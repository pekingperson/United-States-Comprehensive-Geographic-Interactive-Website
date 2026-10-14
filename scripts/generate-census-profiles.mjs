import { createReadStream } from "node:fs";
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { pathToFileURL } from "node:url";

export const RELEASE = { id: "acs2024_5yr", name: "ACS 2024 5-year", years: "2020-2024" };
const ROOT = new URL("../", import.meta.url);
const CACHE = new URL("reports/census-profile-cache/", ROOT);
const OUTPUT = new URL("data/census-profiles/", ROOT);
const SOURCE = "https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/";
const LEVELS = new Set(["010", "020", "030", "040", "050", "060", "140", "150", "160",
  "252", "310", "330", "400", "500", "610", "620", "795", "860", "950", "960", "970"]);

export function normalizeGeoid(value) {
  // Keep total-population components only; preserve legislative district letters and hyphens.
  const match = /^(\d{3})[0-9A-Z]{2}00US([0-9A-Z-]*)$/.exec(value);
  return match && LEVELS.has(match[1]) ? `${match[1]}00US${match[2]}` : null;
}

export function estimate(value) {
  if (!value || !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function shardFor(geoid) {
  const [level, suffix] = geoid.split("00US");
  const prefix = suffix.slice(0, ["140", "150"].includes(level) ? 5 : 2);
  return `${level}/${prefix || "us"}.json`;
}

export function profileColumns(app) {
  const columns = new Set([...app.matchAll(/\bB\d{8}\b/g)].map((match) => match[0]));
  // Educational-attainment columns are constructed as a range in buildMetrics.
  for (let column = 17; column <= 25; column += 1) columns.add(`B15003${String(column).padStart(3, "0")}`);
  const tables = new Map();
  for (const column of [...columns].sort()) {
    const table = column.slice(0, 6);
    if (!tables.has(table)) tables.set(table, []);
    tables.get(table).push(column);
  }
  return [...tables].map(([id, columns]) => ({ id, columns }));
}

async function download(relative) {
  const path = new URL(relative.split("/").pop(), CACHE);
  try { await access(path); return path; } catch { /* Fetch uncached official files. */ }
  const pending = new URL(`${path.href}.partial`);
  const response = await fetch(`${SOURCE}${relative}`, {
    headers: { "User-Agent": "UnitedStatesInteractiveMap/1.0 (public Census profile data build)" },
    signal: AbortSignal.timeout(300000)
  });
  if (!response.ok || !response.body) throw new Error(`Census download failed: ${relative} (${response.status})`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(pending));
  await rename(pending, path);
  return path;
}

async function readRows(path, consume) {
  const lines = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  let headers;
  for await (const line of lines) {
    const cells = line.replace(/^\uFEFF/, "").split("|");
    if (!headers) headers = new Map(cells.map((name, index) => [name, index]));
    else consume(cells, headers);
  }
}

export async function build() {
  await mkdir(CACHE, { recursive: true });
  const tables = profileColumns(await readFile(new URL("assets/app.js", ROOT), "utf8"));
  const records = new Map();
  console.log("Reading official ACS 2024 geography names...");
  await readRows(await download("documentation/Geos20245YR.txt"), (cells, headers) => {
    const geoid = normalizeGeoid(cells[headers.get("GEO_ID")]);
    if (!geoid) return;
    const name = cells[headers.get("NAME")];
    if (!name) throw new Error(`Missing Census name: ${geoid}`);
    if (records.has(geoid)) throw new Error(`Duplicate Census geography: ${geoid}`);
    records.set(geoid, [name, ...tables.map(() => null)]);
  });
  console.log(`Indexed ${records.size.toLocaleString()} geographies.`);

  // Two public bulk downloads at a time; never issue a request for each geography.
  let next = 0;
  const counts = {};
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (next < tables.length) {
      const tableIndex = next++;
      const table = tables[tableIndex];
      console.log(`Loading ${table.id} (${table.columns.length} profile columns)...`);
      const path = await download(`data/5YRData/acsdt5y2024-${table.id.toLowerCase()}.dat`);
      let indexes;
      let count = 0;
      await readRows(path, (cells, headers) => {
        indexes ??= table.columns.map((column) => {
          const index = headers.get(`${table.id}_E${column.slice(6)}`);
          if (index == null) throw new Error(`Missing source column ${column}`);
          return index;
        });
        const geoid = normalizeGeoid(cells[headers.get("GEO_ID")]);
        const record = records.get(geoid);
        if (!record) return;
        if (record[tableIndex + 1]) throw new Error(`Duplicate ${table.id} record: ${geoid}`);
        record[tableIndex + 1] = indexes.map((index) => estimate(cells[index]));
        count += 1;
      });
      counts[table.id] = count;
      console.log(`Read ${table.id}: ${count.toLocaleString()} profiles.`);
    }
  }));

  const populationIndex = tables.findIndex((table) => table.id === "B01001") + 1;
  const shards = new Map();
  const byLevel = {};
  for (const [geoid, record] of records) {
    if (record[populationIndex]?.[0] == null) continue;
    const shard = shardFor(geoid);
    if (!shards.has(shard)) shards.set(shard, {});
    shards.get(shard)[geoid] = record;
    const level = geoid.slice(0, 3);
    byLevel[level] = (byLevel[level] || 0) + 1;
  }
  let bytes = 0;
  for (const [path, rows] of shards) {
    const file = new URL(path, OUTPUT);
    await mkdir(new URL("./", file), { recursive: true });
    const contents = `${JSON.stringify({ version: 1, release: RELEASE.id, rows })}\n`;
    bytes += Buffer.byteLength(contents);
    await writeFile(file, contents);
  }
  const manifest = {
    version: 1, release: RELEASE, source: { name: "U.S. Census Bureau, ACS 2024 5-year Summary File", url: SOURCE },
    tables, files: [...shards.keys()].sort(), byLevel, tableCounts: counts,
    profileCount: Object.values(byLevel).reduce((sum, count) => sum + count, 0), bytes,
    notes: "Profile estimate columns only. Negative Census suppression codes and blanks are null, never zero. All estimates use 2020-2024 ACS; no other vintages are merged."
  };
  await writeFile(new URL("manifest.json", OUTPUT), `${JSON.stringify(manifest)}\n`);
  console.log(`Saved ${manifest.profileCount.toLocaleString()} profiles in ${shards.size} shards (${(bytes / 1e6).toFixed(1)} MB).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await build();
}
