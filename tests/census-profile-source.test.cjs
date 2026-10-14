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

function setup(fetch, timers = {}) {
  const context = vm.createContext({ module: { exports: {} }, URLSearchParams, AbortController,
    fetch, setTimeout, clearTimeout, ...timers });
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
