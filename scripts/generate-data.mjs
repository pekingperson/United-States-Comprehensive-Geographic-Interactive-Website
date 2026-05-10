import { mkdir, writeFile } from "node:fs/promises";

const TIGER_LAYER =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/88/query";
const CR_DATA = "https://api.censusreporter.org/1.0/data/show/latest";
const OUTPUT = new URL("../data/urban-areas.json", import.meta.url);
const BOUNDARY_OUTPUT = new URL("../data/urban-area-boundaries.json", import.meta.url);

const INDEX_TABLES = [
  "B01001",
  "B01002",
  "B19013",
  "B19301",
  "B17001",
  "B11001",
  "B25001",
  "B25077",
  "B15003",
  "B05002",
  "B21001",
  "B03002",
  "B08303",
  "B08006"
];

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function fetchTigerAttributes() {
  const countUrl = new URL(TIGER_LAYER);
  countUrl.search = new URLSearchParams({
    where: "1=1",
    returnCountOnly: "true",
    f: "json"
  }).toString();

  const { count } = await fetchJson(countUrl);
  const pageSize = 1000;
  const rows = [];

  for (let offset = 0; offset < count; offset += pageSize) {
    const url = new URL(TIGER_LAYER);
    url.search = new URLSearchParams({
      where: "1=1",
      outFields: "GEOID,NAME,AREALAND,AREAWATER,INTPTLAT,INTPTLON",
      returnGeometry: "false",
      orderByFields: "GEOID",
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
      f: "json"
    }).toString();

    const page = await fetchJson(url);
    rows.push(...page.features.map((feature) => feature.attributes));
  }

  return rows;
}

async function fetchTigerBoundaries() {
  const countUrl = new URL(TIGER_LAYER);
  countUrl.search = new URLSearchParams({
    where: "1=1",
    returnCountOnly: "true",
    f: "json"
  }).toString();

  const { count } = await fetchJson(countUrl);
  const pageSize = 1000;
  const features = [];

  for (let offset = 0; offset < count; offset += pageSize) {
    const url = new URL(TIGER_LAYER);
    url.search = new URLSearchParams({
      where: "1=1",
      outFields: "GEOID,NAME",
      returnGeometry: "true",
      outSR: "4326",
      maxAllowableOffset: "0.00025",
      geometryPrecision: "5",
      orderByFields: "GEOID",
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
      f: "geojson"
    }).toString();

    const page = await fetchJson(url);
    features.push(...page.features);
  }

  return {
    type: "FeatureCollection",
    features
  };
}

async function fetchCensusReporterIndex() {
  const merged = {
    release: null,
    geography: {},
    data: {}
  };

  for (const table of INDEX_TABLES) {
    const url = new URL(CR_DATA);
    url.search = new URLSearchParams({
      table_ids: table,
      geo_ids: "400|01000US"
    }).toString();

    const result = await fetchJson(url);
    merged.release ??= result.release;

    Object.assign(merged.geography, result.geography || {});
    for (const [geoid, tableData] of Object.entries(result.data || {})) {
      merged.data[geoid] ??= {};
      Object.assign(merged.data[geoid], tableData);
    }
  }

  return merged;
}

function value(data, table, column) {
  return data?.[table]?.estimate?.[column] ?? null;
}

function sumValues(data, table, columns) {
  const values = columns.map((column) => value(data, table, column));
  if (values.some((item) => item == null)) return null;
  return values.reduce((sum, item) => sum + item, 0);
}

function pct(numerator, denominator) {
  if (numerator == null || denominator == null || denominator === 0) return null;
  return (numerator / denominator) * 100;
}

function round(value, places = 1) {
  if (value == null || Number.isNaN(value)) return null;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function buildMetrics(data) {
  const population = value(data, "B01001", "B01001001");
  const households = value(data, "B11001", "B11001001");
  const povertyTotal = value(data, "B17001", "B17001001");
  const povertyBelow = value(data, "B17001", "B17001002");
  const educationTotal = value(data, "B15003", "B15003001");
  const highSchoolPlus = sumValues(
    data,
    "B15003",
    Array.from({ length: 9 }, (_, index) => `B15003${String(index + 17).padStart(3, "0")}`)
  );
  const bachelorsPlus = sumValues(
    data,
    "B15003",
    Array.from({ length: 4 }, (_, index) => `B15003${String(index + 22).padStart(3, "0")}`)
  );
  const foreignBorn = value(data, "B05002", "B05002013");
  const foreignBornTotal = value(data, "B05002", "B05002001");
  const raceTotal = value(data, "B03002", "B03002001");
  const commuteTotal = value(data, "B08303", "B08303001");
  const commuteUnder30 = sumValues(data, "B08303", [
    "B08303002",
    "B08303003",
    "B08303004",
    "B08303005",
    "B08303006",
    "B08303007"
  ]);
  const workers = value(data, "B08006", "B08006001");

  return {
    population,
    medianAge: value(data, "B01002", "B01002001"),
    male: value(data, "B01001", "B01001002"),
    female: value(data, "B01001", "B01001026"),
    perCapitaIncome: value(data, "B19301", "B19301001"),
    medianHouseholdIncome: value(data, "B19013", "B19013001"),
    povertyRate: round(pct(povertyBelow, povertyTotal), 1),
    povertyCount: povertyBelow,
    households,
    personsPerHousehold: round(population && households ? population / households : null, 2),
    housingUnits: value(data, "B25001", "B25001001"),
    medianHomeValue: value(data, "B25077", "B25077001"),
    highSchoolRate: round(pct(highSchoolPlus, educationTotal), 1),
    bachelorsRate: round(pct(bachelorsPlus, educationTotal), 1),
    foreignBornRate: round(pct(foreignBorn, foreignBornTotal), 1),
    foreignBorn,
    workers,
    commuteUnder30Rate: round(pct(commuteUnder30, commuteTotal), 1),
    race: {
      white: round(pct(value(data, "B03002", "B03002003"), raceTotal), 1),
      black: round(pct(value(data, "B03002", "B03002004"), raceTotal), 1),
      native: round(pct(value(data, "B03002", "B03002005"), raceTotal), 1),
      asian: round(pct(value(data, "B03002", "B03002006"), raceTotal), 1),
      pacific: round(pct(value(data, "B03002", "B03002007"), raceTotal), 1),
      other: round(pct(value(data, "B03002", "B03002008"), raceTotal), 1),
      multiracial: round(pct(value(data, "B03002", "B03002009"), raceTotal), 1),
      hispanic: round(pct(value(data, "B03002", "B03002012"), raceTotal), 1)
    }
  };
}

function numeric(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const tigerAreas = await fetchTigerAttributes();
const censusReporter = await fetchCensusReporterIndex();
const tigerBoundaries = await fetchTigerBoundaries();

const areas = tigerAreas.map((area) => {
  const geoid = `40000US${area.GEOID}`;
  const data = censusReporter.data[geoid];
  const landArea = numeric(area.AREALAND);
  const metrics = buildMetrics(data);

  return {
    geoid,
    tigerGeoid: area.GEOID,
    name: censusReporter.geography[geoid]?.name || area.NAME,
    tigerName: area.NAME,
    center: [numeric(area.INTPTLON), numeric(area.INTPTLAT)],
    landSquareMiles: landArea == null ? null : round(landArea / 2589988.110336, 1),
    density:
      landArea == null || metrics.population == null
        ? null
        : round(metrics.population / (landArea / 2589988.110336), 1),
    metrics,
    hasCensusReporterData: Boolean(data)
  };
});

areas.sort((a, b) => (b.metrics.population || 0) - (a.metrics.population || 0));

const payload = {
  generatedAt: new Date().toISOString(),
  source: {
    censusReporterData: "https://api.censusreporter.org/1.0/data/show/latest",
    tigerUrbanAreas:
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/88",
    censusDotsTiles: "https://tiles.censusdots.com/file/race-tiles/{z}/{x}/{y}.png"
  },
  release: censusReporter.release,
  count: areas.length,
  areas
};

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(payload)}\n`);
await writeFile(BOUNDARY_OUTPUT, `${JSON.stringify(tigerBoundaries)}\n`);

console.log(`Wrote ${areas.length} urban areas to ${OUTPUT.pathname}`);
console.log(`Wrote ${tigerBoundaries.features.length} boundaries to ${BOUNDARY_OUTPUT.pathname}`);
