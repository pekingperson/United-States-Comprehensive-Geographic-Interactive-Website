(function (root) {
  const VERSION = "20261014-race-history";
  const requests = new Map();
  const FIELDS = ["year", "source", "total", "white", "black", "native", "asian", "pacific",
    "other", "multiple", "hispanic", "whiteNonHispanic", "asianPacific", "nativeOther"];
  const CATEGORIES = [
    ["white", "White", "#73b2ff"],
    ["black", "Black", "#9fd400"],
    ["native", "American Indian / Alaska Native", "#d4a017"],
    ["asian", "Asian", "#ff0000"],
    ["pacific", "Native Hawaiian / Pacific Islander", "#00a6a6"],
    ["other", "Other race", "#996633"],
    ["multiple", "Two or more races", "#8c51b5"],
    ["asianPacific", "Asian / Pacific Islander", "#ff0000"],
    ["nativeOther", "Native American / Other race", "#996633"]
  ];

  function readFile(path) {
    if (!requests.has(path)) {
      const request = root.CensusProfileSource.readJson(`data/census-race-history/${path}?v=${VERSION}`)
        .catch((error) => { requests.delete(path); throw error; });
      requests.set(path, request);
    }
    return requests.get(path);
  }

  function shardFor(geoid) {
    const match = /^(\d{3})00US([0-9]*[RT]?)$/.exec(geoid);
    if (!match) return null;
    const prefix = match[2].slice(0, ["140", "150"].includes(match[1]) ? 5 : 2);
    return `${match[1]}/${prefix || "us"}.json`;
  }

  function decode(row) {
    if (!Array.isArray(row)) throw new Error("Invalid historical Census record.");
    const record = Object.fromEntries(FIELDS.map((field, index) => [field, row[index] ?? null]));
    if (!Number.isInteger(record.year) || record.year < 1790 || record.year > 2020 ||
        (record.year % 10 && ![1929, 1939].includes(record.year)) ||
        !Number.isSafeInteger(record.total) || record.total < 0 || typeof record.source !== "string") {
      throw new Error("Invalid historical Census record.");
    }
    for (const field of FIELDS.slice(3)) {
      if (record[field] != null && (!Number.isSafeInteger(record[field]) || record[field] < 0 || record[field] > record.total)) {
        throw new Error("Invalid historical Census population count.");
      }
    }
    record.meta = row[14] ?? {};
    if (typeof record.meta !== "object" || Array.isArray(record.meta)) throw new Error("Invalid Census notes.");
    if (record.meta.notes != null && (!Array.isArray(record.meta.notes) || record.meta.notes.some((note) => typeof note !== "string"))) {
      throw new Error("Invalid Census notes.");
    }
    if (record.meta.ethnicityTotal != null && (!Number.isSafeInteger(record.meta.ethnicityTotal) || record.meta.ethnicityTotal < 0)) {
      throw new Error("Invalid Census sample universe.");
    }
    if (record.meta.ethnicityShares != null && (typeof record.meta.ethnicityShares !== "object" ||
        Array.isArray(record.meta.ethnicityShares) || Object.values(record.meta.ethnicityShares).some((share) =>
          !Number.isFinite(share) || share < 0 || share > 100))) {
      throw new Error("Invalid Census sample percentage.");
    }
    if (record.meta.extraRaces != null && !Array.isArray(record.meta.extraRaces)) throw new Error("Invalid Census categories.");
    for (const item of record.meta.extraRaces || []) {
      if (!item || typeof item.label !== "string" || !Number.isSafeInteger(item.count) || item.count < 0 || item.count > record.total) {
        throw new Error("Invalid historical Census category.");
      }
    }
    return record;
  }

  async function load(geoid) {
    const path = shardFor(geoid);
    if (!path) return [];
    const manifest = await readFile("manifest.json");
    if (manifest?.version !== 1 || !Array.isArray(manifest.files)) {
      requests.delete("manifest.json");
      throw new Error("Historical Census index is unavailable.");
    }
    if (!manifest.files.includes(path)) return [];
    const data = await readFile(path);
    try {
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid historical Census data.");
      const rows = data[geoid]?.records || [];
      return rows.map(decode).sort((a, b) => a.year - b.year);
    } catch (error) {
      requests.delete(path);
      throw error;
    }
  }

  function source(record) {
    if (/^wp56-\d{2}$/.test(record.source)) {
      const table = record.source.slice(-2);
      return { label: `U.S. Census Bureau, historical table ${Number(table)}`,
        url: `https://www2.census.gov/library/working-papers/2002/demo/pop-twps0056/table${table}.pdf` };
    }
    if (/^wp76-[a-z]{2}$/.test(record.source)) {
      return { label: "U.S. Census Bureau, historical city tables",
        url: `https://www2.census.gov/library/working-papers/2005/demo/pop-twps0076/${record.source.slice(-2)}tab.pdf` };
    }
    if (record.source === "sf1990") return { label: "1990 Census, Summary Tape File 1",
      url: "https://www2.census.gov/census_1990/STF1A_ASCII/" };
    if (record.source === "sf2000") return { label: "2000 Census, Summary File 1",
      url: "https://www2.census.gov/census_2000/datasets/Summary_File_1/" };
    if (record.source === "sf2010") return { label: "2010 Census, Summary File 1",
      url: "https://www2.census.gov/census_2010/04-Summary_File_1/" };
    if (record.source === "sf2020") return { label: "2020 Census, Demographic and Housing Characteristics File",
      url: "https://www2.census.gov/programs-surveys/decennial/2020/data/demographic-and-housing-characteristics-file/" };
    if (record.source === "sf1980") return { label: "1980 Census, Summary Tape File 1 via Missouri Census Data Center",
      url: "https://mcdc.missouri.edu/data/census_1980/stf801/" };
    const folders = { 2020: "dhc2020x", 2010: "sf12010x", 2000: "census_2000/sf12000x",
      1990: "census_1990/stf901x2", 1980: "census_1980/stf801x" };
    return { label: `${record.year} Census via Missouri Census Data Center`,
      url: `https://mcdc.missouri.edu/data/${folders[record.year] || ""}/` };
  }

  function rows(record) {
    return CATEGORIES.filter(([key]) => record[key] != null).map(([key, label, color]) => ({
      label, color, count: record[key], share: record.total > 0 ? record[key] / record.total * 100 : null
    })).concat((record.meta?.extraRaces || []).map((item) => ({
      ...item, color: "#996633", share: record.total > 0 ? item.count / record.total * 100 : null
    })));
  }

  function ethnicityRows(record) {
    const total = record.meta?.ethnicityTotal ?? record.total;
    return [["hispanic", "Hispanic / Latino (any race)", "#ffaa00"],
      ["whiteNonHispanic", "White, non-Hispanic", "#73b2ff"]]
      .filter(([key]) => record[key] != null).map(([key, label, color]) => ({
        label, color, count: record[key],
        share: record.meta?.ethnicityShares?.[key] ?? (total > 0 ? record[key] / total * 100 : null)
      }));
  }

  function periods(records) {
    return [...new Set(records.map((record) => String(record.year)))].sort().concat("current");
  }

  function adjacent(records, selected, direction) {
    const values = periods(records);
    const index = values.indexOf(String(selected));
    return index < 0 ? "current" : values[Math.max(0, Math.min(values.length - 1, index + direction))];
  }

  const api = { load, decode, shardFor, source, rows, ethnicityRows, periods, adjacent };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CensusRaceHistory = api;
})(globalThis);
