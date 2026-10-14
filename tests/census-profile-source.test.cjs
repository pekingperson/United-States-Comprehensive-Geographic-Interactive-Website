const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");

const script = readFileSync(require.resolve("../assets/census-profile-source.js"), "utf8");
const app = readFileSync(require.resolve("../assets/app.js"), "utf8");
const geoid = "86000US43064";
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const batch = (tables) => ({
  release: { id: "acs2024_5yr", name: "ACS 2024 5-year" },
  data: { [geoid]: Object.fromEntries(tables.map((table) => [table, { estimate: { [`${table}001`]: 100 } }])) },
  geography: { [geoid]: { name: "43064" } }, tables: {}
});

function setup(fetch, timers = {}, bundledFetch = async () => json({}, 404)) {
  const context = vm.createContext({ module: { exports: {} }, URLSearchParams, AbortController,
    fetch: (url, options) => String(url).startsWith("data/census-profiles/") ? bundledFetch(url, options) : fetch(url, options),
    setTimeout, clearTimeout, ...timers });
  vm.runInContext(script, context);
  return context.module.exports;
}

test("supported profile tables load in one request, with concurrent requests deduplicated", async () => {
  let calls = 0;
  const api = setup(async () => { calls += 1; return json(batch(["B01001", "B16004"])); });
  const [first, second] = await Promise.all([
    api.loadTables(geoid, ["B01001", "B16004"]), api.loadTables(geoid, ["B01001", "B16004"])
  ]);
  assert.equal(calls, 1);
  assert.equal(first, second);
  assert.equal(first.data[geoid].B01001.estimate.B01001001, 100);
});

const savedIndex = {
  version: 1, release: { id: "acs2024_5yr", name: "ACS 2024 5-year", years: "2020-2024" },
  source: { name: "U.S. Census Bureau", url: "https://www2.census.gov/" },
  tables: [
    { id: "B01001", columns: ["B01001001", "B01001002", "B01001026"] },
    { id: "B19013", columns: ["B19013001"] },
    { id: "B05002", columns: ["B05002001", "B05002013"] }
  ], files: ["860/43.json"]
};
const savedShard = () => ({ version: 1, release: "acs2024_5yr", rows: {
  [geoid]: ["ZCTA5 43064", [100, 40, 60], [80000], [100, 20]],
  "86000US43065": ["ZCTA5 43065", [0, 0, 0], [null], null]
} });
const savedResponse = (url, shard = savedShard()) => json(url.includes("manifest.json") ? savedIndex : shard);

test("bundled profiles load with every live service blocked and keep the correct ACS vintage", async () => {
  for (const failure of [403, 429, 503, "Failed to fetch"]) {
    let liveCalls = 0;
    const files = [];
    const api = setup(async () => { liveCalls += 1; throw new Error(String(failure)); }, {}, async (url) => {
      files.push(url); return savedResponse(url);
    });
    const [first, second] = await Promise.all([
      api.loadTables(geoid, ["B01001", "B19013"]), api.loadTables(geoid, ["B01001", "B05002"])
    ]);
    assert.equal(liveCalls, 0);
    assert.equal(files.length, 2, "one shared manifest and one shared shard");
    assert.equal(first.data[geoid].B01001.estimate.B01001026, 60);
    assert.equal(first.data[geoid].B19013.estimate.B19013001, 80000);
    assert.equal(second.data[geoid].B05002.estimate.B05002013, 20);
    assert.equal(first.release.id, "acs2024_5yr");
    assert.equal(first.source.bundled, true);
    assert.equal(first.geography[geoid].name, "ZCTA5 43064");
  }
});

test("unpublished and suppressed saved data stay unavailable, while real zero estimates stay zero", async () => {
  const api = setup(async () => { throw new Error("Live API must not be used"); }, {}, (url) => savedResponse(url));
  const result = await api.loadTables("86000US43065", ["B01001", "B19013", "B05002"]);
  const data = result.data["86000US43065"];
  assert.equal(data.B01001.estimate.B01001001, 0);
  assert.equal(data.B19013.estimate.B19013001, null);
  assert.equal(data.B05002, undefined);
  assert.equal(result.unavailableTables.join(","), "B05002");
});

test("missing, corrupt, and wrong-vintage saved files fall back to live data without mixing releases", async () => {
  for (const corrupt of [
    { version: 1, release: "acs2023_5yr", rows: savedShard().rows },
    { version: 1, release: "acs2024_5yr", rows: { [geoid]: ["Bad", [-666666666, 40, 60], [80000], null] } },
    { version: 1, release: "acs2024_5yr", rows: {} },
    { version: 1, release: "acs2024_5yr", rows: { [geoid]: ["Truncated"] } }
  ]) {
    let liveCalls = 0;
    const api = setup(async () => { liveCalls += 1; return json(batch(["B01001"])); }, {},
      async (url) => savedResponse(url, corrupt));
    const result = await api.loadTables(geoid, ["B01001"]);
    assert.equal(liveCalls, 1);
    assert.equal(result.data[geoid].B01001.estimate.B01001001, 100);
    assert.equal(result.source, undefined);
  }
});

test("an interrupted saved shard is evicted and can be retried, without caching an empty profile", async () => {
  let broken = true;
  const api = setup(async () => json({}, 403), {}, async (url) => {
    if (broken && !url.includes("manifest.json")) throw new TypeError("Failed to fetch");
    return savedResponse(url);
  });
  await assert.rejects(api.loadTables(geoid, ["B01001"]));
  broken = false;
  const result = await api.loadTables(geoid, ["B01001"]);
  assert.equal(result.source.bundled, true);
});

test("geography identifiers cannot traverse saved files and legislative letters are preserved", async () => {
  const api = setup(async () => { throw new Error("Should not fetch"); });
  assert.equal(api.shardFor("01000US"), "010/us.json");
  assert.equal(api.shardFor("15000US391590506012"), "150/39159.json");
  assert.equal(api.shardFor("62000US500A1"), "620/50.json");
  await assert.rejects(api.loadTables("../../profile", ["B01001"]), /Invalid Census geography/);
});

test("unpublished tables do not discard available statistics or mix ACS vintages", async () => {
  const calls = [];
  const api = setup(async (url) => {
    calls.push(url);
    const tables = new URL(url).searchParams.get("table_ids").split(",");
    return tables.includes("MISSING") ? json({ error: "Not published" }, 400) : json(batch(tables));
  });
  const result = await api.loadTables(geoid, ["B01001", "MISSING", "B16004"]);
  assert.deepEqual(Object.keys(result.data[geoid]), ["B01001", "B16004"]);
  assert.equal(result.unavailableTables.join(","), "MISSING");
  assert.ok(calls.slice(1).every((url) => url.includes("/acs2024_5yr?")));
});

test("blocked providers are not retried per table or cached as empty successful profiles", async () => {
  for (const status of [403, 429, 503]) {
    let calls = 0;
    const api = setup(async () => { calls += 1; return json({ error: "Unavailable" }, status); });
    await assert.rejects(api.loadTables(geoid, ["B01001", "B16004", "B19013"]), /Census data request failed/);
    assert.equal(calls, status === 503 ? 2 : 1);
  }
});

test("missing geographies stop after the population check instead of requesting every table", async () => {
  let calls = 0;
  const api = setup(async () => { calls += 1; return json({ error: "Geography not found" }, 400); });
  await assert.rejects(api.loadTables(geoid, ["B01001", "B16004", "B19013"]));
  assert.equal(calls, 2);
});

test("a failed request can be retried successfully and empty responses are rejected", async () => {
  let failed = true;
  const api = setup(async () => failed ? json({ data: {} }) : json(batch(["B01001"])));
  await assert.rejects(api.loadTables(geoid, ["B01001"]), /empty profile/);
  failed = false;
  assert.ok((await api.loadTables(geoid, ["B01001"])).data[geoid].B01001);
});

test("stalled requests are aborted instead of leaving a profile loading forever", async () => {
  let aborted = 0;
  const api = setup(async (url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => { aborted += 1; reject(new Error("Timed out")); });
  }), { setTimeout: (callback) => setTimeout(callback, 0) });
  await assert.rejects(api.readJson("https://example.test/profile"), /Timed out/);
  assert.equal(aborted, 2);
});

test("language statistics preserve the age-5-plus universe and never coerce missing data to zero", () => {
  const context = vm.createContext({ ANCESTRY_ETHNIC_MAP: {}, LANGUAGE_ETHNIC_MAP: {}, ETHNIC_GROUP_LIMIT: 12 });
  vm.runInContext(app.slice(app.indexOf("function metric("), app.indexOf("function missingMetric(")), context);
  const data = { B16004: { estimate: { B16004001: 1000, B16004003: 100, B16004025: 400, B16004047: 200 } } };
  assert.equal(context.buildMetrics(data).nonEnglishRate, 30);
  delete data.B16004.estimate.B16004025;
  assert.equal(context.buildMetrics(data).nonEnglishRate, null);
  const tables = app.slice(app.indexOf("const DETAIL_TABLES"), app.indexOf("const GEOGRAPHY_TYPES"));
  assert.match(tables, /"B16004"/);
});

test("a separate metadata outage cannot prevent a valid Census profile from rendering", async () => {
  const context = vm.createContext({
    state: { profileCache: new Map(), geometryCache: new Map(), selectedGeoid: geoid, selectedName: "43064" },
    areaByGeoid: () => null, fetchDetailTables: async () => batch(["B01001"]),
    buildMetrics: (tables) => ({ population: tables.B01001.estimate.B01001001 })
  });
  vm.runInContext(app.slice(app.indexOf("async function loadProfile("), app.indexOf("async function loadSchoolRatings(")), context);
  const profile = await context.loadProfile(geoid);
  assert.equal(profile.metrics.population, 100);
  assert.equal(profile.metadata.display_name, "43064");
});

test("fit-to-boundary zoom is above the exclusive block-group visibility threshold", () => {
  let settings;
  const context = vm.createContext({
    FIT_DURATION: 220, geographyForGeoid: () => ({ minZoom: 10 }),
    map: { getView: () => ({ fit: (extent, options) => { settings = options; } }) }
  });
  vm.runInContext(app.slice(app.indexOf("function fitGeoidFeature("), app.indexOf("async function showSelectedGeometry(")), context);
  context.fitGeoidFeature("15000US391590506012", { getGeometry: () => ({ getExtent: () => [0, 0, 1, 1] }) });
  assert.equal(settings.maxZoom, 11);
});

test("ordinary urban areas use saved boundaries, not an unnecessary remote request", async () => {
  const expected = { type: "FeatureCollection", features: [] };
  const context = vm.createContext({
    state: { geometryCache: new Map() }, areaByGeoid: () => ({ name: "Test Urban Area" }),
    loadLocalUrbanGeometry: async () => expected
  });
  vm.runInContext(app.slice(app.indexOf("async function loadDetailedGeometry("), app.indexOf("function fitGeoidFeature(")), context);
  assert.equal(await context.loadDetailedGeometry("40000US80389"), expected);
});

test("optional profile errors never replace working Census statistics with a failure screen", async () => {
  const rendered = [];
  let failures = 0;
  const profile = { metrics: { population: 100 } };
  const context = vm.createContext({
    state: { activeGeography: "place" }, window: { location: {} }, console: { warn() {} },
    geographyForGeoid: () => ({ id: "place" }), isGeographyAllowed: () => true,
    exampleForType: () => null, areaByGeoid: () => null,
    selectedSource: { clear() {} }, urbanLayer: { changed() {} }, renderList() {}, renderLoading() {},
    projectLayer: { changed() {} }, publicHousingLayer: { changed() {} },
    showSelectedGeometry() {}, loadProfile: async () => profile,
    renderProfile: (...args) => rendered.push(args), renderError: () => { failures += 1; },
    loadGeographyExtras: async () => { throw new TypeError("Failed to fetch"); }
  });
  vm.runInContext(app.slice(app.indexOf("async function selectArea("), app.indexOf("async function fitSelectedArea(")), context);
  await context.selectArea(geoid, { skipHash: true });
  assert.equal(failures, 0);
  assert.equal(rendered.length, 2);
  assert.equal(rendered[1][1], profile);
  assert.match(rendered[1][2].notice, /Census statistics remain available/);
});
