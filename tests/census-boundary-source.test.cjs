const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");

const script = readFileSync(require.resolve("../assets/census-boundary-source.js"), "utf8");
const extent = [-13619200, 6033600, -13580000, 6072800];
const primaryUrl = "https://embed.censusreporter.org/1.0/geo/tiger2024/tiles/140/10/164/357.mvt";
const row = (geoid) => ({ attributes: { GEOID: geoid, NAME: "Census Tract" }, geometry: { rings: [] } });
const json = (body) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });

function setup(fetch, options = {}) {
  const context = vm.createContext({
    module: { exports: {} }, URLSearchParams, AbortController, fetch,
    setTimeout: options.setTimeout || setTimeout, clearTimeout,
    console: { warn() {} }
  });
  vm.runInContext(script, context);
  const formats = [];
  const ol = {
    format: {
      GeoJSON: class { readFeatures(payload) { return [payload]; } },
      MVT: class { readFeatures(bytes, settings) {
        formats.push({ format: "mvt", settings });
        if (options.invalidMvt) throw new Error("Invalid MVT");
        return [{ bytes }];
      } },
      EsriJSON: class { readFeatures(payload, settings) {
        formats.push({ format: "esri", settings });
        return payload.features;
      } }
    },
    source: { VectorTile: class { constructor(settings) { this.settings = settings; } } }
  };
  const source = context.module.exports.createSource(ol, { sumlevel: options.sumlevel || "140", url: primaryUrl });
  return { source, formats, api: context.module.exports };
}

function loadTile(source) {
  return new Promise((resolve) => {
    const tile = {
      setLoader(loader) { this.loader = loader; },
      setFeatures(features) { resolve({ state: 2, features }); },
      setState(state) { resolve({ state }); }
    };
    source.settings.tileLoadFunction(tile, primaryUrl);
    tile.loader(extent, 76.437, "EPSG:3857");
  });
}

test("successful MVT tiles retain the requested projection and extent", async () => {
  const { source, formats } = setup(async () => new Response(new Uint8Array([1, 2, 3])));
  const tile = await loadTile(source);
  assert.equal(tile.state, 2);
  assert.equal(formats[0].format, "mvt");
  assert.equal(formats[0].settings.extent, extent);
  assert.equal(formats[0].settings.featureProjection, "EPSG:3857");
});

test("rate-limited tiles fall back to matching 2024 Census boundaries without repeated primary requests", async () => {
  const calls = [];
  const { source, formats } = setup(async (url) => {
    calls.push(url);
    if (url === primaryUrl) return new Response("Rate limited", { status: 429, headers: { "retry-after": "120" } });
    return json({ features: [row("53033001900")] });
  });
  for (let index = 0; index < 3; index += 1) {
    const tile = await loadTile(source);
    assert.equal(tile.features[0].attributes.GEOID, "53033001900");
  }
  assert.equal(calls.filter((url) => url === primaryUrl).length, 1);
  const fallback = new URL(calls[1]);
  assert.match(fallback.pathname, /tigerWMS_ACS2024\/MapServer\/8\/query$/);
  assert.equal(fallback.searchParams.get("geometry"), extent.join(","));
  assert.equal(fallback.searchParams.get("inSR"), "3857");
  assert.equal(fallback.searchParams.get("outSR"), "3857");
  assert.equal(Number(fallback.searchParams.get("maxAllowableOffset")), 76.437 / 4);
  assert.equal(formats[0].settings.featureProjection, "EPSG:3857");
});

test("dense tiles load every Census page instead of leaving holes after a transfer limit", async () => {
  const offsets = [];
  const { source } = setup(async (url) => {
    if (url === primaryUrl) throw new TypeError("Failed to fetch");
    const offset = Number(new URL(url).searchParams.get("resultOffset"));
    offsets.push(offset);
    return json({ features: [row(offset ? "06001400200" : "06001400100")], exceededTransferLimit: offset === 0 });
  });
  const tile = await loadTile(source);
  assert.equal(tile.state, 2);
  assert.equal(tile.features.length, 2);
  assert.deepEqual(offsets, [0, 1]);
});

test("an invalid or truncated MVT uses the Census fallback", async () => {
  const { source } = setup(async (url) => url === primaryUrl
    ? new Response("not a vector tile") : json({ features: [row("48113000100")] }), { invalidMvt: true });
  assert.equal((await loadTile(source)).features[0].attributes.GEOID, "48113000100");
});

test("a stalled primary request is aborted and recovers through the fallback", async () => {
  let aborted = false;
  const { source } = setup(async (url, { signal }) => {
    if (url !== primaryUrl) return json({ features: [row("53033001900")] });
    return new Promise((resolve, reject) => signal.addEventListener("abort", () => {
      aborted = true;
      reject(new Error("Timed out"));
    }));
  }, { setTimeout: (callback) => setTimeout(callback, 0) });
  assert.equal((await loadTile(source)).state, 2);
  assert.equal(aborted, true);
});

test("invalid or incomplete Census responses are errors, not cached empty successful tiles", async () => {
  for (const payload of [{ error: { message: "Unavailable" } }, { features: [], exceededTransferLimit: true }]) {
    const { source } = setup(async (url) => {
      if (url === primaryUrl) throw new TypeError("Network error");
      return json(payload);
    });
    assert.equal((await loadTile(source)).state, 3);
  }
});

test("rapid zoom requests are limited to four concurrent boundary downloads", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  let active = 0;
  let peak = 0;
  let started = 0;
  const { source } = setup(async () => {
    started += 1;
    active += 1;
    peak = Math.max(peak, active);
    await gate;
    active -= 1;
    return new Response(new Uint8Array([1]));
  });
  const tiles = Array.from({ length: 12 }, () => loadTile(source));
  await new Promise(setImmediate);
  assert.equal(started, 4);
  release();
  await Promise.all(tiles);
  assert.equal(peak, 4);
  assert.equal(started, 12);
});

test("county visibility switches at the tract threshold and remains available for county-only overlays", () => {
  const app = readFileSync(require.resolve("../assets/app.js"), "utf8");
  const start = app.indexOf("function updateOpportunityLayerVisibility()");
  const end = app.indexOf("function renderOpportunityLegend", start);
  const layer = () => ({ setVisible() {}, changed() {}, setMaxZoom(zoom) { this.maxZoom = zoom; } });
  const county = layer();
  const context = vm.createContext({
    HAS_OPPORTUNITY_OVERLAYS: true, OPPORTUNITY_TRACT_SWITCH_ZOOM: 7.2,
    activeOpportunityOverlay: () => true,
    opportunityCountyLayer: county, opportunityTractLayer: layer(), opportunityStateLayer: layer(),
    state: { opportunityData: { lookup: { cty: new Map([["cty53033", 1]]), tract: new Map([["53033001900", 1]]), state: new Map() } } }
  });
  vm.runInContext(`${app.slice(start, end)}\nupdateOpportunityLayerVisibility();`, context);
  assert.equal(county.maxZoom, 7.2);
  context.state.opportunityData.lookup.tract.clear();
  vm.runInContext("updateOpportunityLayerVisibility();", context);
  assert.equal(county.maxZoom, Infinity);
});

test("every non-urban map boundary has a working independent fallback", async () => {
  const levels = {
    "020": [62], "030": [60], "040": [80], "050": [82], "060": [22], "140": [8],
    "150": [10], "160": [28, 30], "252": [36, 38, 40], "310": [93, 91], "330": [97],
    "500": [54], "610": [56], "620": [58], "795": [0], "860": [2], "970": [14]
  };
  for (const [sumlevel, expected] of Object.entries(levels)) {
    const layers = [];
    const { source } = setup(async (url) => {
      if (url === primaryUrl) return new Response("Blocked", { status: 429 });
      layers.push(Number(new URL(url).pathname.split("/").at(-2)));
      return json({ features: [row("12345")] });
    }, { sumlevel });
    assert.equal((await loadTile(source)).state, 2);
    assert.deepEqual(layers, expected, sumlevel);
  }
});

test("national tiles reuse one geographic outline when the tile provider is blocked", async () => {
  let outlines = 0;
  const { source } = setup(async (url) => {
    if (url === primaryUrl) return new Response("Blocked", { status: 429 });
    outlines += 1;
    return json({ type: "Feature", properties: { full_geoid: "01000US" }, geometry: { type: "MultiPolygon", coordinates: [] } });
  }, { sumlevel: "010" });
  assert.equal((await loadTile(source)).features[0].properties.full_geoid, "01000US");
  assert.equal((await loadTile(source)).state, 2);
  assert.equal(outlines, 1);
});

test("selected-place geometry checks incorporated places and CDPs and retains land area", async () => {
  const calls = [];
  const { api } = setup(async (url) => {
    calls.push(url);
    return json({ features: calls.length === 1 ? [] : [{ type: "Feature", geometry: { type: "Polygon", coordinates: [] },
      properties: { NAME: "Example CDP", GEOID: "5312345", AREALAND: 5000, AREAWATER: 200 } }] });
  });
  const result = await api.loadGeometry("16000US5312345");
  assert.equal(result.properties.full_geoid, "16000US5312345");
  assert.equal(result.properties.aland, 5000);
  assert.equal(new URL(calls[1]).searchParams.get("where"), "GEOID='5312345'");
  assert.match(calls[0], /MapServer\/28\/query/);
  assert.match(calls[1], /MapServer\/30\/query/);
  await assert.rejects(api.loadGeometry("16000US';bad"), /No Census geometry fallback/);
});
