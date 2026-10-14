const assert = require("node:assert/strict");
const { existsSync, readFileSync, statSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const history = require("../assets/census-race-history.js");
const script = readFileSync(require.resolve("../assets/census-race-history.js"), "utf8");
const app = readFileSync(require.resolve("../assets/app.js"), "utf8");
const dataRoot = path.join(__dirname, "../data/census-race-history");
const manifest = JSON.parse(readFileSync(path.join(dataRoot, "manifest.json")));
const geoid = "86000US43064";
const sample = [2020, "sf2020", 100, 50, 20, 5, 10, 0, 5, 10, 15, 45, null, null];

function setup(readJson) {
  const context = vm.createContext({ module: { exports: {} }, CensusProfileSource: { readJson } });
  vm.runInContext(script, context);
  return context.module.exports;
}

function fixture(url) {
  return url.includes("manifest.json") ? { version: 1, files: ["860/43.json"] }
    : { [geoid]: { records: [sample, [2010, ...sample.slice(1)]] } };
}

test("routes every supported boundary type to a same-origin shard and keeps small-area downloads small", () => {
  for (const [id, expected] of [["01000US", "010/us.json"], ["02000US1", "020/1.json"],
    ["03000US3", "030/3.json"], ["04000US39", "040/39.json"], ["05000US39159", "050/39.json"],
    ["14000US39159050601", "140/39159.json"], ["15000US391590506012", "150/39159.json"],
    ["25200US2430R", "252/24.json"], [geoid, "860/43.json"]]) {
    assert.equal(history.shardFor(id), expected);
  }
  assert.equal(history.shardFor("../../secret"), null);
});

test("loads only available records in chronological order, deduplicating simultaneous requests", async () => {
  const calls = [];
  const api = setup(async (url) => { calls.push(url); return fixture(url); });
  const [first, second] = await Promise.all([api.load(geoid), api.load(geoid)]);
  assert.equal(first.map((record) => record.year).join(), "2010,2020");
  assert.equal(second.length, 2);
  assert.equal(calls.length, 2);
  assert.ok(calls.every((url) => url.startsWith("data/census-race-history/")));
  await api.load(geoid);
  assert.equal(calls.length, 2);
});

test("missing geographies do not fetch nonexistent shards or fabricate records", async () => {
  let calls = 0;
  const api = setup(async (url) => { calls += 1; return fixture(url); });
  assert.equal((await api.load("04000US00")).length, 0);
  assert.equal(calls, 1);
  assert.equal((await api.load("86000US43999")).length, 0);
  assert.equal(calls, 2);
  assert.equal((await api.load("invalid")).length, 0);
});

test("network failures and malformed responses can be retried", async () => {
  for (const failure of ["network", "manifest", "record"]) {
    let broken = true;
    const api = setup(async (url) => {
      if (broken && failure === "network") throw new Error("Offline");
      if (broken && failure === "manifest" && url.includes("manifest")) return null;
      if (broken && failure === "record" && !url.includes("manifest")) return { [geoid]: { records: [[2020, "bad", -1]] } };
      return fixture(url);
    });
    await assert.rejects(api.load(geoid));
    broken = false;
    assert.equal((await api.load(geoid)).length, 2);
  }
});

test("arrows skip unavailable censuses, stop at both ends, and include current ACS", () => {
  const records = [{ year: 1980 }, { year: 2020 }, { year: 2000 }];
  assert.deepEqual(history.periods(records), ["1980", "2000", "2020", "current"]);
  assert.equal(history.adjacent(records, "current", -1), "2020");
  assert.equal(history.adjacent(records, "2000", -1), "1980");
  assert.equal(history.adjacent(records, "1980", -1), "1980");
  assert.equal(history.adjacent(records, "2020", 1), "current");
  assert.equal(history.adjacent([], "current", -1), "current");
});

test("historical categories preserve zero versus unavailable and avoid a zero-population divide", () => {
  const record = history.decode(sample);
  const rows = history.rows(record);
  assert.equal(rows.length, 7);
  assert.equal(rows.find((row) => row.label.includes("Pacific")).count, 0);
  assert.ok(!rows.some((row) => row.label === "Asian / Pacific Islander"));
  assert.equal(rows.reduce((sum, row) => sum + row.count, 0), record.total);
  assert.ok(history.rows(history.decode([2020, "sf2020", 0, 0])).every((row) => row.share === null));
  assert.throws(() => history.decode([2020, "sf2020", 100, 100.5]));
  assert.throws(() => history.decode([2020, "sf2020", 100, 101]));
  assert.equal(history.decode([1939, "wp56-16", 72524]).year, 1939);
});

test("sample ethnicity uses its own universe or the published percentage", () => {
  const record = history.decode([1970, "wp56-01", 100, 80, 20, null, null, null, null, null, 10, 75, null, null,
    { ethnicitySample: true, ethnicityTotal: 125 }]);
  assert.equal(history.ethnicityRows(record)[0].share, 8);
  record.meta.ethnicityShares = { hispanic: 7.9 };
  assert.equal(history.ethnicityRows(record)[0].share, 7.9);
});

test("malformed historical metadata is rejected before rendering", () => {
  for (const meta of [false, [], { notes: "bad" }, { notes: [1] }, { ethnicityTotal: -1 },
    { ethnicityShares: { hispanic: 101 } }, { ethnicityShares: [] }, { extraRaces: {} }, { extraRaces: [null] }]) {
    assert.throws(() => history.decode([...sample, meta]));
  }
});

test("matching historical race categories keep the map's existing colors", () => {
  const record = history.decode(sample);
  const colors = Object.fromEntries(history.rows(record).concat(history.ethnicityRows(record)).map((row) => [row.label, row.color]));
  assert.equal(colors.White, "#73b2ff");
  assert.equal(colors.Black, "#9fd400");
  assert.equal(colors.Asian, "#ff0000");
  assert.equal(colors["Hispanic / Latino (any race)"], "#ffaa00");
  assert.equal(colors["Two or more races"], "#8c51b5");
});

function profileSetup(load = async () => [history.decode(sample)], merged = false) {
  const listeners = {};
  const section = { dataset: { geoid }, innerHTML: "",
    querySelectorAll: () => [-1, 1].map((step) => ({ dataset: { raceStep: String(step) },
      addEventListener: (_, callback) => { listeners[step] = callback; } })),
    querySelector: (selector) => ({ addEventListener: (_, callback) => { listeners[selector] = callback; }, focus: () => {} }) };
  const context = vm.createContext({
    state: { selectedGeoid: geoid, raceHistory: new Map() }, CensusRaceHistory: { ...history, load },
    document: { querySelector: (selector) => { assert.equal(selector, "#profile-race"); return section; } },
    areaByGeoid: () => merged ? { isMergedUrbanArea: true } : null,
    escapeHtml: (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"),
    tr: (text) => text, number: String, pct: (value) => value == null ? "Not available" : `${value}%`,
    currentRaceRows: () => "CURRENT ACS CHART"
  });
  const historyEnd = app.indexOf("\nfunction ", app.indexOf("async function loadRaceHistory("));
  assert.ok(historyEnd > app.indexOf("function raceHistoryState("));
  vm.runInContext(app.slice(app.indexOf("function raceHistoryState("), historyEnd), context);
  return { context, section, listeners, profile: { detail: { release: { name: "ACS 2024 5-year" } }, metrics: { race: {} } } };
}

test("year controls update only the race section and survive later profile renders", async () => {
  const { context, section, listeners, profile } = profileSetup();
  await context.loadRaceHistory(geoid, profile);
  assert.match(section.innerHTML, /CURRENT ACS CHART/);
  listeners[-1]();
  assert.equal(context.raceHistoryState(geoid).selected, "2020");
  assert.match(section.innerHTML, /100 people counted in 2020/);
  assert.match(context.raceChart(geoid, profile), /value="2020" selected/);
  listeners[1]();
  assert.match(section.innerHTML, /CURRENT ACS CHART/);
});

test("late history responses cannot overwrite a different geography", async () => {
  let resolve;
  const pending = new Promise((done) => { resolve = done; });
  const { context, section, profile } = profileSetup(() => pending);
  const loading = context.loadRaceHistory(geoid, profile);
  context.state.selectedGeoid = "04000US39";
  section.dataset.geoid = "04000US39";
  section.innerHTML = "OHIO";
  resolve([history.decode(sample)]);
  await loading;
  assert.equal(section.innerHTML, "OHIO");
  assert.equal(context.raceHistoryState(geoid).status, "ready");
});

test("load errors preserve current ACS and expose retry; merged areas never use one component's history", async () => {
  let calls = 0;
  const failed = profileSetup(async () => { calls += 1; throw new Error("Offline"); });
  await failed.context.loadRaceHistory(geoid, failed.profile);
  assert.match(failed.section.innerHTML, /CURRENT ACS CHART/);
  assert.match(failed.section.innerHTML, /data-race-retry/);
  await failed.context.loadRaceHistory(geoid, failed.profile);
  assert.equal(calls, 2);
  const merged = profileSetup(async () => { throw new Error("Should not fetch"); }, true);
  await merged.context.loadRaceHistory(geoid, merged.profile);
  assert.equal(merged.context.raceHistoryState(geoid).status, "ready");
  assert.match(merged.section.innerHTML, /custom merged urban boundary/);
});

test("every generated record decodes, has a source, and lives in its indexed small shard", () => {
  let records = 0;
  for (const file of manifest.files) {
    assert.ok(statSync(path.join(dataRoot, file)).size < 4_000_000, `${file} is too large for a profile request`);
    const areas = JSON.parse(readFileSync(path.join(dataRoot, file)));
    for (const [id, area] of Object.entries(areas)) {
      assert.equal(history.shardFor(id), file);
      const years = new Set();
      for (const packed of area.records) {
        const record = history.decode(packed);
        assert.ok(!years.has(record.year), `${id}: duplicate ${record.year}`);
        years.add(record.year);
        assert.ok(history.source(record).url.startsWith("https://"));
        if (/^sf(?:1980|1990|2000|2010|2020)$/.test(record.source)) {
          assert.equal(history.rows(record).reduce((sum, row) => sum + row.count, 0), record.total, `${id} ${record.year}`);
        }
        records += 1;
      }
    }
  }
  assert.ok(records > 1_000_000);
  assert.ok(manifest.coverage["140:1990"] > 60_000);
  assert.ok(manifest.coverage["150:2000"] > 200_000);
  assert.ok(manifest.coverage["860:2020"] > 33_000);
});

test("known real-world counts and pre-1960 territorial tables remain correct", () => {
  const load = (id) => JSON.parse(readFileSync(path.join(dataRoot, history.shardFor(id))))[id].records.map(history.decode);
  const nation = load("01000US");
  assert.equal(nation.find((record) => record.year === 1790).total, 3_929_214);
  assert.equal(nation.find((record) => record.year === 2020).hispanic, 62_080_044);
  assert.equal(nation.find((record) => record.year === 1860).hispanic, null);
  assert.equal(nation.find((record) => record.year === 1970).hispanic, 9_072_602);
  assert.equal(load(geoid).find((record) => record.year === 2020).total, 17_301);
  assert.equal(load("04000US02").find((record) => record.year === 1939).total, 72_524);
  assert.equal(load("04000US15").find((record) => record.year === 1950).total, 499_794);
});

test("all app entry points load the history helper before the application", () => {
  const files = ["index.html", "political-map.html", "nonpolitical-map.html"];
  if (existsSync(path.join(__dirname, "../urban-projects-map.html"))) files.push("urban-projects-map.html");
  for (const file of files) {
    const html = readFileSync(path.join(__dirname, "..", file), "utf8");
    assert.ok(html.indexOf("assets/census-profile-source.js") < html.indexOf("assets/census-race-history.js"));
    assert.ok(html.indexOf("assets/census-race-history.js") < html.indexOf("assets/app.js"));
  }
});
