const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");

const data = JSON.parse(readFileSync(require.resolve("../data/ancestry-tracts.json"), "utf8"));
const generator = readFileSync(require.resolve("../scripts/generate-ancestry-overlay.mjs"), "utf8");
const groups = generator.slice(generator.indexOf("const CENTRAL_EAST_EUROPE"), generator.indexOf("const TABLES"));
const classifier = generator.slice(generator.indexOf("function categoryFor("), generator.indexOf("function registerIdentity("));
const context = vm.createContext({});
vm.runInContext(groups + classifier, context);

test("American uses Northern & Western Europe in the published dataset and generator", () => {
  const identity = data.identities.find((entry) => entry.label === "American");
  const category = data.categories.find((entry) => entry.id === "north_west_europe");
  assert.equal(identity.id, 3);
  assert.equal(identity.category, category.id);
  assert.equal(identity.color, category.color);
  assert.equal(context.categoryFor("B04006", "Estimate!!Total:!!American", "American", "B04006_E004"), category.id);
});

test("Indigenous and other North American identities retain their existing categories", () => {
  for (const label of ["American Indian / Alaska Native", "Cajun", "Canadian", "French Canadian", "Pennsylvania German"]) {
    const identity = data.identities.find((entry) => entry.label === label);
    assert.equal(identity.category, "north_american_indigenous", label);
    assert.equal(identity.color, "#007f73", label);
  }
  assert.equal(context.categoryFor("B02001", "", "American Indian / Alaska Native", "B02001_E004"), "north_american_indigenous");
  assert.equal(context.categoryFor("B04006", "", "Canadian", ""), "north_american_indigenous");
});

test("every published identity uses its regional color", () => {
  for (const identity of data.identities) {
    const category = data.categories.find((entry) => entry.id === identity.category);
    assert.ok(category, identity.label);
    assert.equal(identity.color, category.color, identity.label);
  }
});
