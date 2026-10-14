(function (root) {
  const API = "https://api.censusreporter.org/1.0";
  const BUNDLE_VERSION = "20261014-local-profiles";
  const requests = new Map();
  const bundledFiles = new Map();

  async function readJson(url) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          const error = new Error(`Census data request failed (${response.status}). Please try again shortly.`);
          error.status = response.status;
          throw error;
        }
        return await response.json();
      } catch (error) {
        // Never turn a blocked or unavailable service into a burst of per-table requests.
        if (attempt || (error.status >= 400 && error.status < 500)) throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async function tableBatch(geoid, tables, release) {
    const params = new URLSearchParams({ table_ids: tables.join(","), geo_ids: geoid });
    const result = await readJson(`${API}/data/show/${release}?${params}`);
    if (!result.release?.id || !Object.keys(result.data?.[geoid] || {}).length) {
      throw new Error("Census returned an empty profile. Please try again shortly.");
    }
    return result;
  }

  async function availableTables(geoid, tables, result) {
    if (!tables.length) return;
    try {
      const batch = await tableBatch(geoid, tables, result.release.id);
      Object.assign(result.data[geoid], batch.data[geoid]);
      Object.assign(result.tables, batch.tables);
    } catch (error) {
      if (error.status !== 400) throw error;
      if (tables.length === 1) {
        result.unavailableTables.push(tables[0]);
        return;
      }
      const middle = Math.ceil(tables.length / 2);
      await availableTables(geoid, tables.slice(0, middle), result);
      await availableTables(geoid, tables.slice(middle), result);
    }
  }

  async function fetchTables(geoid, tables) {
    try {
      return await tableBatch(geoid, tables, "latest");
    } catch (error) {
      if (error.status !== 400) throw error;
    }
    // Small geographies do not publish every table. Keep all recovered tables on one vintage.
    const result = await tableBatch(geoid, ["B01001"], "acs2024_5yr");
    result.tables ??= {};
    result.unavailableTables = [];
    await availableTables(geoid, tables.filter((table) => table !== "B01001"), result);
    return result;
  }

  function shardFor(geoid) {
    const match = /^(\d{3})00US([0-9A-Z-]*)$/.exec(geoid);
    if (!match) return null;
    const prefix = match[2].slice(0, ["140", "150"].includes(match[1]) ? 5 : 2);
    return `${match[1]}/${prefix || "us"}.json`;
  }

  function readBundledFile(path) {
    if (!bundledFiles.has(path)) {
      // Bound memory while keeping the shared index and nearby profile shards warm.
      if (bundledFiles.size >= 16) {
        const oldest = [...bundledFiles.keys()].find((key) => key !== "manifest.json");
        bundledFiles.delete(oldest);
      }
      bundledFiles.set(path, readJson(`data/census-profiles/${path}?v=${BUNDLE_VERSION}`)
        .catch((error) => { bundledFiles.delete(path); throw error; }));
    }
    return bundledFiles.get(path);
  }

  function decodeProfile(geoid, requested, manifest, shard) {
    if (shard?.version !== 1 || shard.release !== manifest.release.id || !shard.rows) {
      throw new Error("Invalid saved Census profile data.");
    }
    const row = shard.rows[geoid];
    if (!row) return null;
    if (!Array.isArray(row) || typeof row[0] !== "string" || !row[0] || row.length !== manifest.tables.length + 1) {
      throw new Error("Invalid saved Census profile record.");
    }
    const data = {};
    const unavailableTables = [];
    for (const table of requested) {
      const index = manifest.tables.findIndex((item) => item.id === table);
      const columns = manifest.tables[index].columns;
      const values = row[index + 1];
      if (values === null) { unavailableTables.push(table); continue; }
      if (!Array.isArray(values) || values.length !== columns.length ||
          values.some((value) => value !== null && (!Number.isFinite(value) || value < 0))) {
        throw new Error("Invalid saved Census estimates.");
      }
      data[table] = { estimate: Object.fromEntries(columns.map((column, columnIndex) => [column, values[columnIndex]])) };
    }
    if (!Object.keys(data).length) return null;
    return {
      release: manifest.release, geography: { [geoid]: { name: row[0] } }, data: { [geoid]: data },
      tables: {}, unavailableTables, source: { ...manifest.source, bundled: true }
    };
  }

  async function loadBundledTables(geoid, tables) {
    const path = shardFor(geoid);
    if (!path) return null;
    const manifest = await readBundledFile("manifest.json");
    if (manifest?.version !== 1 || !manifest.release?.id || !Array.isArray(manifest.files) ||
        !Array.isArray(manifest.tables) || manifest.tables.some((table) =>
          !/^B\d{5}$/.test(table.id) || !Array.isArray(table.columns) || !table.columns.length ||
          table.columns.some((column) => !new RegExp(`^${table.id}\\d{3}$`).test(column)))) {
      bundledFiles.delete("manifest.json");
      throw new Error("Invalid saved Census profile index.");
    }
    if (!manifest.files.includes(path) || tables.some((id) => !manifest.tables.some((table) => table.id === id))) return null;
    try {
      return decodeProfile(geoid, tables, manifest, await readBundledFile(path));
    } catch (error) {
      bundledFiles.delete(path);
      throw error;
    }
  }

  async function loadAvailableTables(geoid, tables) {
    try {
      const saved = await loadBundledTables(geoid, tables);
      if (saved) return saved;
    } catch { /* A missing or interrupted static download can still use the live service. */ }
    return fetchTables(geoid, tables);
  }

  function loadTables(geoid, tables) {
    if (!shardFor(geoid)) return Promise.reject(new Error("Invalid Census geography identifier."));
    const key = `${geoid}:${tables.join(",")}`;
    if (!requests.has(key)) {
      requests.set(key, loadAvailableTables(geoid, tables).finally(() => requests.delete(key)));
    }
    return requests.get(key);
  }

  const api = { readJson, loadTables, shardFor };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CensusProfileSource = api;
})(globalThis);
