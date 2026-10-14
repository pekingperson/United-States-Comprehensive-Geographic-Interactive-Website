const assert = require("node:assert/strict");
const { readFileSync, statSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const source = require("../assets/census-profile-source.js");

const root = path.join(__dirname, "../data/census-profiles");
const manifest = JSON.parse(readFileSync(path.join(root, "manifest.json")));
const app = readFileSync(path.join(__dirname, "../assets/app.js"), "utf8");
const rowFor = (geoid) => JSON.parse(readFileSync(path.join(root, source.shardFor(geoid)))).rows[geoid];
const value = (row, column) => {
  const index = manifest.tables.findIndex((table) => table.id === column.slice(0, 6));
  return row[index + 1]?.[manifest.tables[index].columns.indexOf(column)];
};

test("Census import distinguishes missing and suppressed estimates from valid zeros", async () => {
  const importer = await import("../scripts/generate-census-profiles.mjs");
  for (const missing of ["", " ", "N", "(X)", "-666666666", "-999999999", "NaN"]) {
    assert.equal(importer.estimate(missing), null);
  }
  assert.equal(importer.estimate("0"), 0);
  assert.equal(importer.estimate("41.5"), 41.5);
  assert.equal(importer.normalizeGeoid("0100000US"), "01000US");
  assert.equal(importer.normalizeGeoid("1600000US0617610"), "16000US0617610");
  assert.equal(importer.normalizeGeoid("5001900US3907"), "50000US3907");
  assert.equal(importer.normalizeGeoid("620L600US50A-1"), "62000US50A-1");
  assert.equal(importer.normalizeGeoid("010C201US"), null);
  assert.equal(importer.normalizeGeoid("0100089US"), null);
  for (const table of importer.profileColumns(app)) {
    const saved = manifest.tables.find((item) => item.id === table.id);
    assert.ok(saved && table.columns.every((column) => saved.columns.includes(column)));
  }
});

test("all profile tables and calculated education columns are included in the offline dataset", () => {
  const tableIds = [...app.slice(app.indexOf("const DETAIL_TABLES"), app.indexOf("const GEOGRAPHY_TYPES"))
    .matchAll(/"(B\d{5})"/g)].map((match) => match[1]);
  assert.ok(tableIds.every((id) => manifest.tables.some((table) => table.id === id)));
  const columns = new Set(manifest.tables.flatMap((table) => table.columns));
  for (const match of app.matchAll(/\bB\d{8}\b/g)) assert.ok(columns.has(match[0]));
  for (let column = 17; column <= 25; column += 1) assert.ok(columns.has(`B15003${String(column).padStart(3, "0")}`));
});

test("every saved profile has a name, valid estimates, population, and one consistent release", () => {
  const totals = {};
  const tableCounts = {};
  let count = 0;
  for (const file of manifest.files) {
    assert.ok(statSync(path.join(root, file)).size < 4_000_000, `${file} must remain small enough for a profile request`);
    const shard = JSON.parse(readFileSync(path.join(root, file)));
    assert.equal(shard.version, 1);
    assert.equal(shard.release, manifest.release.id);
    for (const [geoid, row] of Object.entries(shard.rows)) {
      assert.equal(source.shardFor(geoid), file);
      assert.equal(row.length, manifest.tables.length + 1);
      assert.ok(typeof row[0] === "string" && row[0].length);
      assert.ok(Number.isFinite(value(row, "B01001001")));
      for (const [index, table] of manifest.tables.entries()) {
        const values = row[index + 1];
        if (values === null) continue;
        assert.equal(values.length, table.columns.length);
        assert.ok(values.every((value) => value === null || (Number.isFinite(value) && value >= 0)));
        tableCounts[table.id] = (tableCounts[table.id] || 0) + 1;
      }
      const level = geoid.slice(0, 3);
      totals[level] = (totals[level] || 0) + 1;
      count += 1;
    }
  }
  assert.equal(count, manifest.profileCount);
  assert.ok(count > 450000);
  assert.deepEqual(totals, manifest.byLevel);
  assert.deepEqual(tableCounts, manifest.tableCounts);
});

test("every mapped boundary type and the reported Cupertino profile has usable saved Census data", () => {
  const examples = app.slice(app.indexOf("const GEOGRAPHY_TYPES"), app.indexOf("const GEOGRAPHY_BY_ID"));
  for (const match of examples.matchAll(/geoid: "([^"]+)"/g)) {
    const row = rowFor(match[1]);
    assert.ok(row, `Missing boundary type: ${match[1]}`);
    assert.ok(value(row, "B01001001") >= 0);
    assert.ok(value(row, "B03002001") >= 0);
  }
  assert.match(rowFor("16000US0617610")[0], /Cupertino/);
  assert.equal(value(rowFor("01000US"), "B01001001"), 334922499);
});
