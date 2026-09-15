import { mkdir, writeFile } from "node:fs/promises";

const ACS_YEAR = 2024;
const ACS_RELEASE = `${ACS_YEAR} ACS 5-year`;
const API_ROOT = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5/groups`;
const SUMMARY_ROOT = `https://www2.census.gov/programs-surveys/acs/summary_file/${ACS_YEAR}/table-based-SF/data/5YRData`;
const OUTPUT_URL = new URL("../data/ancestry-tracts.json", import.meta.url);
const BREAKDOWN_DIRECTORY_URL = new URL("../data/ancestry-breakdowns/", import.meta.url);

const CATEGORIES = [
  {
    id: "north_west_europe",
    label: "Northern & Western Europe",
    color: "#2f6df6"
  },
  {
    id: "central_east_europe",
    label: "Central & Eastern Europe",
    color: "#8e35d1"
  },
  {
    id: "southern_europe",
    label: "Southern Europe",
    color: "#ed2939"
  },
  {
    id: "middle_east_north_africa",
    label: "Middle East & North Africa",
    color: "#ff7a00"
  },
  {
    id: "sub_saharan_africa",
    label: "Sub-Saharan Africa",
    color: "#8f4a1f"
  },
  {
    id: "east_asia",
    label: "East Asia",
    color: "#00b8d9"
  },
  {
    id: "southeast_asia",
    label: "Southeast Asia",
    color: "#00bd4f"
  },
  {
    id: "south_central_asia",
    label: "South & Central Asia",
    color: "#9ac900"
  },
  {
    id: "pacific_islands",
    label: "Pacific Islands",
    color: "#3145ff"
  },
  {
    id: "latin_america",
    label: "Latin America",
    color: "#ffc400"
  },
  {
    id: "caribbean",
    label: "Caribbean",
    color: "#f000c8"
  },
  {
    id: "north_american_indigenous",
    label: "North American & Indigenous",
    color: "#007f73"
  },
  {
    id: "other",
    label: "Other ancestry",
    color: "#7b8794"
  }
];

const CATEGORY_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]));
const CENTRAL_EAST_EUROPE = new Set([
  "Albanian",
  "Bulgarian",
  "Carpatho Rusyn",
  "Croatian",
  "Czech",
  "Czechoslovakian",
  "Eastern European",
  "Estonian",
  "German Russian",
  "Hungarian",
  "Latvian",
  "Lithuanian",
  "Macedonian",
  "Polish",
  "Romanian",
  "Russian",
  "Serbian",
  "Slavic",
  "Slovak",
  "Slovene",
  "Soviet Union",
  "Ukrainian",
  "Yugoslavian"
]);
const SOUTHERN_EUROPE = new Set(["Basque", "Cypriot", "Greek", "Italian", "Maltese", "Portuguese"]);
const NORTH_AMERICAN = new Set(["American", "Cajun", "Canadian", "French Canadian", "Pennsylvania German"]);

const TABLES = [
  {
    id: "B04006",
    title: "People Reporting Ancestry",
    totalColumn: "B04006_E001",
    include(index, apiLabel) {
      return index > 1 && index < 108 && index !== 2 && !apiLabel.endsWith(":");
    }
  },
  {
    id: "B03001",
    title: "Hispanic or Latino Origin by Specific Origin",
    include(index, apiLabel) {
      return index >= 4 && !apiLabel.endsWith(":");
    }
  },
  {
    id: "B02018",
    title: "Asian Alone or in Any Combination by Selected Groups",
    include(index) {
      return index >= 2;
    }
  },
  {
    id: "B02019",
    title: "Native Hawaiian and Other Pacific Islander Alone or in Any Combination by Selected Groups",
    optional: true,
    include(index) {
      return index >= 2;
    }
  },
  {
    id: "B02001",
    title: "Race",
    include(index) {
      return index === 3 || index === 4 || index === 6;
    }
  }
];

const identities = [];
const identityByLabel = new Map();
const tractRecords = new Map();
const tractBreakdowns = new Map();
const countyRecords = new Map();

function cleanLabel(label) {
  return label
    .replace(/^Estimate!!/, "")
    .split("!!")
    .at(-1)
    .replace(/:$/, "")
    .replace("Chinese, except Taiwanese", "Chinese")
    .replace("Dominican (Dominican Republic)", "Dominican")
    .replace("Black or African American alone", "Black / African American")
    .replace("American Indian and Alaska Native alone", "American Indian / Alaska Native")
    .replace("Native Hawaiian and Other Pacific Islander alone", "Native Hawaiian / Pacific Islander")
    .replace("Other Native Hawaiian and Other Pacific Islander, not specified", "Other Pacific Islander")
    .trim();
}

function categoryFor(tableId, apiLabel, label, column) {
  if (tableId === "B02018") {
    if (label === "Vietnamese") return "east_asia";
    if (label === "Hmong" || apiLabel.includes("!!Southeast Asian:!!")) return "southeast_asia";
    if (apiLabel.includes("!!East Asian:!!")) return "east_asia";
    return "south_central_asia";
  }
  if (tableId === "B02019") return "pacific_islands";
  if (tableId === "B03001") {
    return /^(Puerto Rican|Cuban|Dominican)$/.test(label) ? "caribbean" : "latin_america";
  }
  if (tableId === "B02001") {
    if (column.endsWith("003")) return "sub_saharan_africa";
    if (column.endsWith("006")) return "pacific_islands";
    return "north_american_indigenous";
  }

  if (apiLabel.includes("Subsaharan African:")) return "sub_saharan_africa";
  if (apiLabel.includes("West Indian (except Hispanic groups):") || label === "Guyanese") return "caribbean";
  if (label === "Brazilian") return "latin_america";
  if (/^(Arab|Other Arab|Armenian|Assyrian\/Chaldean\/Syriac|Egyptian|Iranian|Iraqi|Israeli|Jordanian|Lebanese|Moroccan|Palestinian|Syrian|Turkish)$/.test(label)) {
    return "middle_east_north_africa";
  }
  if (CENTRAL_EAST_EUROPE.has(label)) return "central_east_europe";
  if (SOUTHERN_EUROPE.has(label)) return "southern_europe";
  if (NORTH_AMERICAN.has(label)) return "north_american_indigenous";
  if (label === "Australian" || label === "New Zealander") return "other";
  return "north_west_europe";
}

function registerIdentity(tableId, apiLabel, column) {
  const label = cleanLabel(apiLabel);
  const key = label.toLocaleLowerCase("en-US");
  if (identityByLabel.has(key)) return identityByLabel.get(key);
  const category = categoryFor(tableId, apiLabel, label, column);
  const identity = {
    id: identities.length + 1,
    label,
    category,
    color: CATEGORY_BY_ID.get(category)?.color || CATEGORY_BY_ID.get("other").color
  };
  identities.push(identity);
  identityByLabel.set(key, identity);
  return identity;
}

function updateTop(top, identityId, count) {
  const existing = top.find((entry) => entry.id === identityId);
  if (existing) existing.count = Math.max(existing.count, count);
  else top.push({ id: identityId, count });
  top.sort((a, b) => b.count - a.count || a.id - b.id);
  if (top.length > 3) top.length = 3;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "United States Interactive Map ancestry data builder" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

async function variablesForTable(spec) {
  const metadata = await fetchJson(`${API_ROOT}/${spec.id}.json`);
  return Object.entries(metadata.variables)
    .map(([apiColumn, details]) => {
      const match = apiColumn.match(new RegExp(`^${spec.id}_(\\d{3})E$`));
      if (!match) return null;
      const index = Number(match[1]);
      const column = `${spec.id}_E${match[1]}`;
      return { index, column, apiLabel: details.label };
    })
    .filter((variable) => variable && spec.include(variable.index, variable.apiLabel))
    .sort((a, b) => a.index - b.index)
    .map((variable) => ({ ...variable, identity: registerIdentity(spec.id, variable.apiLabel, variable.column) }));
}

function processTractLine(line, context) {
  if (!line.startsWith("1400000US")) return false;
  const cells = line.split("|");
  const rawGeoid = cells[context.geoidIndex] || "";
  const geoid = rawGeoid.slice(-11);
  if (!/^\d{11}$/.test(geoid)) return false;

  let tract = tractRecords.get(geoid);
  if (!tract) {
    tract = { total: 0, top: [] };
    tractRecords.set(geoid, tract);
  }
  let breakdown = tractBreakdowns.get(geoid);
  if (!breakdown) {
    breakdown = [];
    tractBreakdowns.set(geoid, breakdown);
  }

  const countyGeoid = geoid.slice(0, 5);
  let county = countyRecords.get(countyGeoid);
  if (!county) {
    county = { total: 0, values: new Map() };
    countyRecords.set(countyGeoid, county);
  }

  if (context.totalIndex >= 0) {
    const total = Number(cells[context.totalIndex]);
    if (Number.isFinite(total) && total > 0) {
      tract.total = Math.round(total);
      county.total += total;
    }
  }

  for (const variable of context.variables) {
    const count = Number(cells[variable.dataIndex]);
    if (!Number.isFinite(count) || count <= 0) continue;
    updateTop(tract.top, variable.identity.id, count);
    breakdown.push(variable.identity.id, Math.round(count));
    county.values.set(variable.identity.id, (county.values.get(variable.identity.id) || 0) + count);
  }
  return true;
}

async function processTable(spec) {
  const variables = await variablesForTable(spec);
  const url = `${SUMMARY_ROOT}/acsdt5y${ACS_YEAR}-${spec.id.toLowerCase()}.dat`;
  console.log(`Downloading ${spec.id}: ${spec.title}`);
  const response = await fetch(url, { headers: { "user-agent": "United States Interactive Map ancestry data builder" } });
  if (!response.ok || !response.body) throw new Error(`${response.status} ${response.statusText} for ${url}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let context = null;
  let tractCount = 0;

  const consumeLine = (rawLine) => {
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
    if (!context) {
      const headers = line.replace(/^\uFEFF/, "").split("|");
      const headerMap = new Map(headers.map((header, index) => [header, index]));
      const geoidIndex = headerMap.get("GEO_ID");
      if (geoidIndex == null) throw new Error(`${spec.id} summary file is missing GEO_ID`);
      context = {
        geoidIndex,
        totalIndex: spec.totalColumn ? (headerMap.get(spec.totalColumn) ?? -1) : -1,
        variables: variables
          .map((variable) => ({ ...variable, dataIndex: headerMap.get(variable.column) }))
          .filter((variable) => variable.dataIndex != null)
      };
      if (!context.variables.length) throw new Error(`${spec.id} summary file has no selected ancestry columns`);
      return;
    }
    if (processTractLine(line, context)) {
      tractCount += 1;
      if (tractCount % 25000 === 0) console.log(`  ${spec.id}: ${tractCount.toLocaleString("en-US")} tracts processed`);
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      consumeLine(buffer.slice(0, newline));
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
    }
  }
  buffer += decoder.decode();
  if (buffer) consumeLine(buffer);
  console.log(`  ${spec.id}: finished ${tractCount.toLocaleString("en-US")} tracts`);
}

function compactEntry(total, top) {
  const ranked = top.filter((entry) => entry.count > 0).sort((a, b) => b.count - a.count || a.id - b.id).slice(0, 3);
  if (!ranked.length || !Number.isFinite(total) || total <= 0) return null;
  const compact = [ranked[0].id, Math.round(ranked[0].count), Math.round(total)];
  for (const entry of ranked.slice(1)) compact.push(entry.id, Math.round(entry.count));
  return compact;
}

const includedTables = [];
for (const table of TABLES) {
  try {
    await processTable(table);
    includedTables.push(table);
  } catch (error) {
    if (!table.optional) throw error;
    console.warn(`Skipping optional ${table.id}: ${error.message}`);
  }
}

const tracts = {};
for (const [geoid, record] of tractRecords) {
  const entry = compactEntry(record.total, record.top);
  if (entry) tracts[String(Number(geoid))] = entry;
}

const counties = {};
for (const [geoid, record] of countyRecords) {
  const top = [...record.values].map(([id, count]) => ({ id, count }));
  const entry = compactEntry(record.total, top);
  if (entry) counties[geoid] = entry;
}

function compactBreakdown(values) {
  const byIdentity = new Map();
  for (let index = 0; index + 1 < values.length; index += 2) {
    const identityId = Number(values[index]);
    const count = Number(values[index + 1]);
    if (!Number.isFinite(identityId) || !Number.isFinite(count) || count <= 0) continue;
    byIdentity.set(identityId, Math.max(byIdentity.get(identityId) || 0, count));
  }
  return [...byIdentity]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .flatMap(([identityId, count]) => [identityId, Math.round(count)]);
}

const breakdownsByState = new Map();
let breakdownEntryCount = 0;
for (const [geoid, values] of tractBreakdowns) {
  const compact = compactBreakdown(values);
  if (!compact.length) continue;
  const stateFips = geoid.slice(0, 2);
  if (!breakdownsByState.has(stateFips)) breakdownsByState.set(stateFips, {});
  breakdownsByState.get(stateFips)[String(Number(geoid))] = compact;
  breakdownEntryCount += compact.length / 2;
}

await mkdir(BREAKDOWN_DIRECTORY_URL, { recursive: true });
await Promise.all(
  [...breakdownsByState].map(([stateFips, stateTracts]) =>
    writeFile(
      new URL(`${stateFips}.json`, BREAKDOWN_DIRECTORY_URL),
      `${JSON.stringify({ release: ACS_RELEASE, projection: "EPSG:3857", tracts: stateTracts })}\n`,
      "utf8"
    )
  )
);

const output = {
  generatedAt: new Date().toISOString(),
  release: ACS_RELEASE,
  projection: "EPSG:3857",
  methodology: "Dominant detailed ancestry, Hispanic origin, Asian group, Pacific Islander group, Black identity, or American Indian/Alaska Native identity by ACS estimated count. People can report more than one ancestry. Vietnamese is grouped with East Asia for the regional color scheme.",
  source: {
    name: `U.S. Census Bureau, ${ACS_RELEASE}`,
    url: "https://www.census.gov/data/developers/data-sets/acs-5year.html",
    tables: includedTables.map(({ id, title }) => ({ id, title }))
  },
  inspiration: {
    name: "The New York Times — An American Mosaic",
    url: "https://www.nytimes.com/interactive/2026/07/01/us/america-ancestry-census-data-map.html"
  },
  breakdowns: {
    urlTemplate: "data/ancestry-breakdowns/{state}.json?v=20260817-full-breakdown",
    states: [...breakdownsByState.keys()].sort(),
    entryFormat: "Alternating identity ID and estimated count, sorted by count"
  },
  categories: CATEGORIES,
  identities,
  counties,
  tracts
};

await writeFile(OUTPUT_URL, `${JSON.stringify(output)}\n`, "utf8");
console.log(
  `Wrote ${OUTPUT_URL.pathname}: ${Object.keys(counties).length.toLocaleString("en-US")} counties, ` +
    `${Object.keys(tracts).length.toLocaleString("en-US")} tracts, ${identities.length.toLocaleString("en-US")} identities, ` +
    `${breakdownEntryCount.toLocaleString("en-US")} tract-identity estimates across ${breakdownsByState.size} state files`
);
