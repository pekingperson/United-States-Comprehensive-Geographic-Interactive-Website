(function (root) {
  const API = "https://api.censusreporter.org/1.0";
  const requests = new Map();

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

  function loadTables(geoid, tables) {
    const key = `${geoid}:${tables.join(",")}`;
    if (!requests.has(key)) {
      requests.set(key, fetchTables(geoid, tables).finally(() => requests.delete(key)));
    }
    return requests.get(key);
  }

  const api = { readJson, loadTables };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CensusProfileSource = api;
})(globalThis);
