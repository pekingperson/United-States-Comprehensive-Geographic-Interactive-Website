import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { request as httpsRequest } from "node:https";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const port = Number(process.argv[2] || 4173);
const mapboxProxyPrefix = "/proxy/mapbox/";
const googleSatelliteProxyPrefix = "/proxy/google-satellite/";
const opportunityAtlasProxyPrefix = "/proxy/opportunity-atlas/";
const censusOpportunityProxyPrefix = "/proxy/census-opportunity/";
const googleMapsConfigApiPath = "/api/google-maps-config";
const schoolRatingsApiPath = "/api/school-ratings";
const stateOfficialsApiPath = "/api/state-officials";
const mayorPartyApiPath = "/api/mayor-party";
const censusReporterReferer = "https://censusreporter.org/";
const mapboxCache = new Map();
const maxMapboxCacheItems = 900;
const googleTileCache = new Map();
const maxGoogleTileCacheItems = 1000;
const remoteDataCache = new Map();
const maxRemoteDataCacheItems = 24;
const maxRemoteDataCacheBytes = 8 * 1024 * 1024;
const schoolRatingsCache = new Map();
const maxSchoolRatingsCacheItems = 240;
const mayorPartyCache = new Map();
const maxMayorPartyCacheItems = 500;
const currentGovernorsUrl =
  "https://en.wikipedia.org/w/api.php?action=parse&page=List_of_current_United_States_governors&prop=wikitext&format=json&origin=*";
const commonsFileUrl = "https://commons.wikimedia.org/wiki/Special:FilePath/{file}?width=225";
const educationDataBaseUrl = "https://educationdata.urban.org";
const governorCacheMs = 6 * 60 * 60 * 1000;
let governorCache = null;
let governorCacheLoadedAt = 0;
let governorCacheLoading = null;
let googleSatelliteSession = null;
let googleSatelliteSessionLoading = null;

const stateAbbrToName = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming"
};
const stateNameToAbbr = Object.fromEntries(Object.entries(stateAbbrToName).map(([abbr, name]) => [name.toLowerCase(), abbr]));
const fallbackGovernors = {
  AL: { name: "Kay Ivey", party: "Republican" },
  AK: { name: "Mike Dunleavy", party: "Republican" },
  AZ: { name: "Katie Hobbs", party: "Democrat" },
  AR: { name: "Sarah Huckabee Sanders", party: "Republican" },
  CA: { name: "Gavin Newsom", party: "Democrat" },
  CO: { name: "Jared Polis", party: "Democrat" },
  CT: { name: "Ned Lamont", party: "Democrat" },
  DE: { name: "Matt Meyer", party: "Democrat" },
  FL: { name: "Ron DeSantis", party: "Republican" },
  GA: { name: "Brian Kemp", party: "Republican" },
  HI: { name: "Josh Green", party: "Democrat" },
  ID: { name: "Brad Little", party: "Republican" },
  IL: { name: "JB Pritzker", party: "Democrat" },
  IN: { name: "Mike Braun", party: "Republican" },
  IA: { name: "Kim Reynolds", party: "Republican" },
  KS: { name: "Laura Kelly", party: "Democrat" },
  KY: { name: "Andy Beshear", party: "Democrat" },
  LA: { name: "Jeff Landry", party: "Republican" },
  ME: { name: "Janet Mills", party: "Democrat" },
  MD: { name: "Wes Moore", party: "Democrat" },
  MA: { name: "Maura Healey", party: "Democrat" },
  MI: { name: "Gretchen Whitmer", party: "Democrat" },
  MN: { name: "Tim Walz", party: "Democrat" },
  MS: { name: "Tate Reeves", party: "Republican" },
  MO: { name: "Mike Kehoe", party: "Republican" },
  MT: { name: "Greg Gianforte", party: "Republican" },
  NE: { name: "Jim Pillen", party: "Republican" },
  NV: { name: "Joe Lombardo", party: "Republican" },
  NH: { name: "Kelly Ayotte", party: "Republican" },
  NJ: { name: "Mikie Sherrill", party: "Democrat" },
  NM: { name: "Michelle Lujan Grisham", party: "Democrat" },
  NY: { name: "Kathy Hochul", party: "Democrat" },
  NC: { name: "Josh Stein", party: "Democrat" },
  ND: { name: "Kelly Armstrong", party: "Republican" },
  OH: { name: "Mike DeWine", party: "Republican" },
  OK: { name: "Kevin Stitt", party: "Republican" },
  OR: { name: "Tina Kotek", party: "Democrat" },
  PA: { name: "Josh Shapiro", party: "Democrat" },
  RI: { name: "Dan McKee", party: "Democrat" },
  SC: { name: "Henry McMaster", party: "Republican" },
  SD: { name: "Larry Rhoden", party: "Republican" },
  TN: { name: "Bill Lee", party: "Republican" },
  TX: { name: "Greg Abbott", party: "Republican" },
  UT: { name: "Spencer Cox", party: "Republican" },
  VT: { name: "Phil Scott", party: "Republican" },
  VA: { name: "Abigail Spanberger", party: "Democrat" },
  WA: { name: "Bob Ferguson", party: "Democrat" },
  WV: { name: "Patrick Morrisey", party: "Republican" },
  WI: { name: "Tony Evers", party: "Democrat" },
  WY: { name: "Mark Gordon", party: "Republican" }
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".tsv": "text/tab-separated-values; charset=utf-8"
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const relative = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = resolve(join(root, relative));
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) return null;
  return filePath;
}

async function proxyMapboxRequest(request, response) {
  const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);
  const targetPath = requestUrl.pathname.slice(mapboxProxyPrefix.length);
  const targetUrl = new URL(`https://api.mapbox.com/${targetPath}`);
  targetUrl.search = requestUrl.search;
  const cacheKey = targetUrl.href;

  const cached = mapboxCache.get(cacheKey);
  if (cached) {
    response.writeHead(cached.status, cached.headers);
    response.end(request.method === "HEAD" ? null : cached.body);
    return;
  }

  const upstream = await fetch(targetUrl, {
    headers: {
      Accept: request.headers.accept || "*/*",
      Referer: censusReporterReferer,
      "User-Agent": "urban-area-census-map/1.0"
    }
  });

  const body = request.method === "HEAD" ? null : Buffer.from(await upstream.arrayBuffer());
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": upstream.ok ? "public, max-age=604800, immutable" : "no-cache",
    "Content-Type": upstream.headers.get("content-type") || "application/octet-stream"
  };

  if (body) headers["Content-Length"] = body.length;

  if (upstream.ok && body) {
    if (mapboxCache.size >= maxMapboxCacheItems) {
      mapboxCache.delete(mapboxCache.keys().next().value);
    }
    mapboxCache.set(cacheKey, { status: upstream.status, headers, body });
  }

  response.writeHead(upstream.status, headers);
  response.end(body);
}

function googleMapsApiKey() {
  return process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY || "";
}

function sendTransparentTile(response) {
  const body = Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"></svg>");
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Content-Length": body.length,
    "Content-Type": "image/svg+xml"
  });
  response.end(body);
}

async function loadGoogleSatelliteSession() {
  const apiKey = googleMapsApiKey();
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not configured");

  const now = Date.now();
  if (googleSatelliteSession?.token && googleSatelliteSession.expiresAt - now > 5 * 60 * 1000) {
    return googleSatelliteSession.token;
  }
  if (googleSatelliteSessionLoading) return googleSatelliteSessionLoading;

  googleSatelliteSessionLoading = (async () => {
    const response = await fetch(`https://tile.googleapis.com/v1/createSession?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "urban-area-census-map/1.0"
      },
      body: JSON.stringify({
        mapType: "satellite",
        language: "en-US",
        region: "US"
      })
    });
    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(`Google Maps session failed (${response.status}). ${message}`.trim());
    }
    const payload = await response.json();
    const expiresAt = payload.expiry ? Number(payload.expiry) * 1000 : Date.now() + 14 * 24 * 60 * 60 * 1000;
    googleSatelliteSession = { token: payload.session, expiresAt };
    return googleSatelliteSession.token;
  })().finally(() => {
    googleSatelliteSessionLoading = null;
  });

  return googleSatelliteSessionLoading;
}

async function proxyGoogleSatelliteRequest(request, response) {
  if (!googleMapsApiKey()) {
    sendTransparentTile(response);
    return;
  }

  const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);
  const parts = requestUrl.pathname
    .slice(googleSatelliteProxyPrefix.length)
    .replace(/\.[a-z]+$/i, "")
    .split("/")
    .map((part) => Number(part));
  const [z, x, y] = parts;
  if (![z, x, y].every(Number.isFinite)) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end("Invalid Google satellite tile path");
    return;
  }

  const session = await loadGoogleSatelliteSession();
  const apiKey = googleMapsApiKey();
  const targetUrl = new URL(`https://tile.googleapis.com/v1/2dtiles/${z}/${x}/${y}`);
  targetUrl.searchParams.set("session", session);
  targetUrl.searchParams.set("key", apiKey);
  const cacheKey = targetUrl.href.replace(apiKey, "{key}");

  const cached = googleTileCache.get(cacheKey);
  if (cached) {
    response.writeHead(cached.status, cached.headers);
    response.end(request.method === "HEAD" ? null : cached.body);
    return;
  }

  const upstream = await fetch(targetUrl, {
    headers: {
      Accept: request.headers.accept || "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": "urban-area-census-map/1.0"
    }
  });

  const body = request.method === "HEAD" ? null : Buffer.from(await upstream.arrayBuffer());
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": upstream.ok ? "public, max-age=604800, immutable" : "no-cache",
    "Content-Type": upstream.headers.get("content-type") || "image/jpeg"
  };
  if (body) headers["Content-Length"] = body.length;

  if (upstream.ok && body) {
    if (googleTileCache.size >= maxGoogleTileCacheItems) {
      googleTileCache.delete(googleTileCache.keys().next().value);
    }
    googleTileCache.set(cacheKey, { status: upstream.status, headers, body });
  }

  response.writeHead(upstream.status, headers);
  response.end(body);
}

function fetchRemoteBuffer(targetUrl, request) {
  return new Promise((resolve, reject) => {
    const upstream = httpsRequest(
      targetUrl,
      {
        method: request.method,
        rejectUnauthorized: false,
        headers: {
          Accept: request.headers.accept || "*/*",
          "User-Agent": "urban-area-census-map/1.0"
        }
      },
      (upstreamResponse) => {
        const chunks = [];
        upstreamResponse.on("data", (chunk) => chunks.push(chunk));
        upstreamResponse.on("end", () => {
          resolve({
            status: upstreamResponse.statusCode || 502,
            headers: upstreamResponse.headers,
            body: request.method === "HEAD" ? null : Buffer.concat(chunks)
          });
        });
      }
    );

    upstream.on("error", reject);
    upstream.end();
  });
}

async function proxyRemoteDataRequest(request, response, prefix, remoteBaseUrl) {
  const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);
  const targetPath = requestUrl.pathname.slice(prefix.length);
  const targetUrl = new URL(targetPath, remoteBaseUrl);
  targetUrl.search = requestUrl.search;
  const cacheKey = `${request.method}:${targetUrl.href}`;

  const cached = remoteDataCache.get(cacheKey);
  if (cached) {
    response.writeHead(cached.status, cached.headers);
    response.end(request.method === "HEAD" ? null : cached.body);
    return;
  }

  const upstream = await fetchRemoteBuffer(targetUrl, request);
  const body = upstream.body;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": upstream.status >= 200 && upstream.status < 300 ? "public, max-age=604800, immutable" : "no-cache",
    "Content-Type": upstream.headers["content-type"] || contentTypes[extname(targetUrl.pathname)] || "application/octet-stream"
  };

  if (body) headers["Content-Length"] = body.length;

  if (upstream.status >= 200 && upstream.status < 300 && body && body.length <= maxRemoteDataCacheBytes) {
    if (remoteDataCache.size >= maxRemoteDataCacheItems) {
      remoteDataCache.delete(remoteDataCache.keys().next().value);
    }
    remoteDataCache.set(cacheKey, { status: upstream.status, headers, body });
  }

  response.writeHead(upstream.status, headers);
  response.end(body);
}

function decodeXmlText(value = "") {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: "\""
  };
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)))
    .replace(/&([a-z]+);/gi, (_, entity) => named[entity.toLowerCase()] || `&${entity};`)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rssTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXmlText(match?.[1] || "");
}

function rssItems(xml = "") {
  return [...String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => ({
    title: rssTag(match[1], "title"),
    url: rssTag(match[1], "link"),
    description: rssTag(match[1], "description"),
    published: rssTag(match[1], "pubDate")
  }));
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").replace(/\s+/g, " ").trim()).filter(Boolean))];
}

function schoolNameCandidates(name) {
  const base = String(name || "")
    .split(",")[0]
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return uniqueStrings([
    base,
    base.replace(/\bCity School District\b/i, "City Schools"),
    base.replace(/\bLocal School District\b/i, "Local Schools"),
    base.replace(/\bUnion Free School District\b/i, "Union Free Schools"),
    base.replace(/\bIndependent School District\b/i, "ISD"),
    base.replace(/\bSchool District\b/i, "Schools"),
    base.replace(/\bDistrict\b/i, "").trim()
  ]);
}

function sourceSearchUrl(source, query) {
  if (source === "Niche") return `https://www.niche.com/k12/search/best-school-districts/?q=${encodeURIComponent(query)}`;
  if (source === "US News") return `https://www.usnews.com/education/k12/search?search=${encodeURIComponent(query)}`;
  return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
}

function nicheDistrictUrl(name, state) {
  if (!name || !state) return "";
  const slug = String(name)
    .split(",")[0]
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug ? `https://www.niche.com/k12/d/${slug}-${state.toLowerCase()}/` : "";
}

function nicheDistrictUrls(name, state) {
  return uniqueStrings(schoolNameCandidates(name).map((candidate) => nicheDistrictUrl(candidate, state)));
}

async function bingRssSearch(query) {
  const url = new URL("https://www.bing.com/search");
  url.searchParams.set("format", "rss");
  url.searchParams.set("q", query);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const upstream = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
      }
    });
    if (!upstream.ok) return [];
    return rssItems(await upstream.text());
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function scoreSchoolResult(item, candidates, source) {
  const haystack = `${item.title} ${item.description} ${item.url}`.toLowerCase();
  const domainScore =
    source === "Niche"
      ? /niche\.com\/k12\/d\//i.test(item.url)
        ? 8
        : -20
      : /usnews\.com\/education\//i.test(item.url)
        ? 8
        : -8;
  const nameScore = candidates.reduce((score, candidate) => {
    const words = candidate.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
    const matches = words.filter((word) => haystack.includes(word)).length;
    return Math.max(score, matches);
  }, 0);
  const pageScore = /\/rankings\/?$/i.test(item.url) ? 1 : 0;
  return domainScore + nameScore + pageScore;
}

function bestSourceItems(items, candidates, source, limit = 5) {
  const seen = new Set();
  return items
    .map((item) => ({ ...item, score: scoreSchoolResult(item, candidates, source) }))
    .filter((item) => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      const key = item.url.replace(/\/$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map(({ score, ...item }) => item);
}

function ratingDescriptor(description = "") {
  const match = description.match(/\bis\s+(?:an?\s+)?([^,.]*?\brated)\b/i);
  if (!match) return "";
  return match[1].replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statFromDescription(description, pattern, label) {
  const match = description.match(pattern);
  return match ? { label, value: match[1] } : null;
}

function schoolLeaid(geoid) {
  const id = String(geoid || "").replace(/^97000US/, "");
  return /^\d+$/.test(id) ? id : "";
}

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function formatWhole(value) {
  const number = positiveNumber(value);
  return number == null ? "" : Math.round(number).toLocaleString("en-US");
}

function formatCurrency(value) {
  const number = positiveNumber(value);
  return number == null
    ? ""
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number);
}

function formatPercentValue(value, digits = 1) {
  const number = positiveNumber(value);
  if (number == null) return "";
  return `${Number.isInteger(number) ? number : number.toFixed(digits).replace(/\.0$/, "")}%`;
}

function ncesGradeLabel(value) {
  const grade = Number(value);
  if (grade === -1) return "PK";
  if (grade === 0) return "K";
  if (Number.isInteger(grade) && grade > 0) return String(grade);
  return "";
}

function ncesGradeSpan(low, high) {
  const start = ncesGradeLabel(low);
  const end = ncesGradeLabel(high);
  if (!start && !end) return "";
  if (start === end) return start;
  if (start === "PK" && end && end !== "PK") return `PK, K-${end}`;
  return [start, end].filter(Boolean).join("-");
}

function apiSchoolData(path, params = {}, timeoutMs = 9000) {
  const url = new URL(path, educationDataBaseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") url.searchParams.set(key, value);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    signal: controller.signal,
    headers: {
      Accept: "application/json",
      "User-Agent": "urban-area-census-map/1.0"
    }
  })
    .then(async (response) => {
      if (!response.ok) return { results: [] };
      return response.json();
    })
    .catch(() => ({ results: [] }))
    .finally(() => clearTimeout(timeout));
}

async function schoolRows(path, leaid, params = {}) {
  const payload = await apiSchoolData(path, { leaid, page_size: 500, ...params });
  return Array.isArray(payload.results) ? payload.results : [];
}

async function firstSchoolRow(path, leaid, params = {}) {
  return (await schoolRows(path, leaid, params))[0] || null;
}

function sumRows(rows, key) {
  return rows.reduce((sum, row) => sum + (positiveNumber(row[key]) || 0), 0);
}

function weightedAssessmentPercent(rows, percentKey, countKey) {
  let total = 0;
  let weighted = 0;
  for (const row of rows) {
    const value = positiveNumber(row[percentKey]);
    const count = positiveNumber(row[countKey]);
    if (value == null || count == null || count <= 0) continue;
    total += count;
    weighted += value * count;
  }
  return total > 0 ? weighted / total : null;
}

async function loadAssessmentRows(leaid) {
  const gradePaths = [3, 4, 5, 6, 7, 8].map((grade) =>
    schoolRows(`/api/v1/school-districts/edfacts/assessments/2020/grade-${grade}/`, leaid)
  );
  return (await Promise.all(gradePaths)).flat();
}

async function loadOfficialSchoolDistrictData(leaid) {
  if (!leaid) return null;
  const [directory, schools, finance, saipe, gradRate, assessments, offerings, teacherStaff] = await Promise.all([
    firstSchoolRow("/api/v1/school-districts/ccd/directory/2024/", leaid),
    schoolRows("/api/v1/schools/ccd/directory/2024/", leaid),
    firstSchoolRow("/api/v1/school-districts/ccd/finance/2020/", leaid),
    firstSchoolRow("/api/v1/school-districts/saipe/2024/", leaid),
    firstSchoolRow("/api/v1/school-districts/edfacts/grad-rates/2019/", leaid),
    loadAssessmentRows(leaid),
    schoolRows("/api/v1/schools/crdc/offerings/2021/", leaid),
    schoolRows("/api/v1/schools/crdc/teachers-staff/2021/", leaid)
  ]);

  if (!directory && !schools.length && !finance && !saipe && !gradRate) return null;
  return { directory, schools, finance, saipe, gradRate, assessments, offerings, teacherStaff };
}

function officialSchoolRatingFields(data, fallbackName = "") {
  if (!data) return {};
  const directory = data.directory || {};
  const finance = data.finance || {};
  const schools = data.schools || [];
  const offerings = data.offerings || [];
  const teacherStaff = data.teacherStaff || [];

  const enrollment = positiveNumber(directory.enrollment) || sumRows(schools, "enrollment");
  const teachers = positiveNumber(directory.teachers_total_fte);
  const freeReduced = sumRows(schools, "free_or_reduced_price_lunch");
  const currentExpense = positiveNumber(finance.exp_current_elsec_total);
  const instructionExpense = positiveNumber(finance.exp_current_instruction_total);
  const supportExpense = positiveNumber(finance.exp_current_supp_serve_total);
  const otherExpense =
    currentExpense == null ? null : Math.max(0, currentExpense - (instructionExpense || 0) - (supportExpense || 0));
  const instructionSalary = positiveNumber(finance.salaries_instruction);
  const firstSecondYearTeachers = teacherStaff.reduce(
    (sum, row) => sum + (positiveNumber(row.teachers_first_year_fte) || 0) + (positiveNumber(row.teachers_second_year_fte) || 0),
    0
  );
  const crdcTeachers = teacherStaff.reduce((sum, row) => sum + (positiveNumber(row.teachers_fte_crdc) || 0), 0);

  const stats = [
    enrollment ? { label: "Students", value: formatWhole(enrollment) } : null,
    ncesGradeSpan(directory.lowest_grade_offered, directory.highest_grade_offered)
      ? { label: "Grades", value: ncesGradeSpan(directory.lowest_grade_offered, directory.highest_grade_offered) }
      : null,
    enrollment && teachers ? { label: "Student-teacher ratio", value: `${Math.round(enrollment / teachers)}:1` } : null,
    weightedAssessmentPercent(data.assessments || [], "read_test_pct_prof_midpt", "read_test_num_valid") != null
      ? {
          label: "Reading proficiency",
          value: formatPercentValue(weightedAssessmentPercent(data.assessments || [], "read_test_pct_prof_midpt", "read_test_num_valid"), 1)
        }
      : null,
    weightedAssessmentPercent(data.assessments || [], "math_test_pct_prof_midpt", "math_test_num_valid") != null
      ? {
          label: "Math proficiency",
          value: formatPercentValue(weightedAssessmentPercent(data.assessments || [], "math_test_pct_prof_midpt", "math_test_num_valid"), 1)
        }
      : null,
    positiveNumber(data.gradRate?.grad_rate_midpt) != null
      ? { label: "Average graduation rate", value: formatPercentValue(data.gradRate.grad_rate_midpt, 1) }
      : null,
    enrollment && freeReduced ? { label: "Free or reduced lunch", value: formatPercentValue((freeReduced / enrollment) * 100, 1) } : null,
    instructionSalary && teachers ? { label: "Average teacher salary", value: formatCurrency(instructionSalary / teachers) } : null,
    firstSecondYearTeachers && crdcTeachers
      ? { label: "Teachers in first/second year", value: formatPercentValue((firstSecondYearTeachers / crdcTeachers) * 100, 1) }
      : null,
    currentExpense && enrollment ? { label: "Expenses per student", value: formatCurrency(currentExpense / enrollment) } : null,
    directory.number_of_schools ? { label: "Schools", value: formatWhole(directory.number_of_schools) } : null,
    teachers ? { label: "Teachers", value: formatWhole(teachers) } : null,
    positiveNumber(data.saipe?.est_population_5_17_poverty_pct) != null
      ? { label: "School-age poverty", value: formatPercentValue(data.saipe.est_population_5_17_poverty_pct * 100, 1) }
      : null
  ].filter(Boolean);

  const address = [
    directory.street_location || directory.street_mailing,
    directory.city_location || directory.city_mailing,
    directory.state_location || directory.state_mailing,
    directory.zip_location || directory.zip_mailing
  ]
    .filter(Boolean)
    .join(", ")
    .replace(/, ([A-Z]{2}), /, ", $1 ");

  const hasAp = offerings.some((row) =>
    [
      row.ap_courses_indicator,
      row.students_select_ap_indicator,
      row.ap_courses_math_indicator,
      row.ap_courses_science_indicator,
      row.ap_courses_other_indicator,
      row.num_courses_ap
    ].some((value) => Number(value) > 0)
  );
  const hasGifted = offerings.some((row) => Number(row.gifted_talented_indicator) > 0);
  const hasDual = offerings.some((row) => Number(row.sch_dual_indicator) > 0);

  const financeBreakdown =
    currentExpense && (instructionExpense || supportExpense || otherExpense)
      ? [
          instructionExpense ? { label: "Instruction", value: Math.round((instructionExpense / currentExpense) * 100) } : null,
          supportExpense ? { label: "Support services", value: Math.round((supportExpense / currentExpense) * 100) } : null,
          otherExpense ? { label: "Other", value: Math.round((otherExpense / currentExpense) * 100) } : null
        ].filter(Boolean)
      : [];

  const highlightedSchools = schools
    .filter((school) => positiveNumber(school.enrollment))
    .sort((a, b) => (positiveNumber(b.enrollment) || 0) - (positiveNumber(a.enrollment) || 0))
    .slice(0, 10)
    .map((school) => ({
      label: school.school_name,
      value: ncesGradeSpan(school.lowest_grade_offered, school.highest_grade_offered) || "School",
      note: `${formatWhole(school.enrollment)} students`
    }));

  return {
    name: fallbackName || directory.lea_name || data.saipe?.district_name || "",
    districtType: "School District",
    location: [directory.city_location || directory.city_mailing, directory.state_location || directory.state_mailing].filter(Boolean).join(", "),
    contact: {
      address,
      phone: directory.phone || ""
    },
    stats,
    offerings: [
      hasAp ? "AP offered" : null,
      hasGifted ? "Gifted program offered" : null,
      hasDual ? "Dual enrollment offered" : null
    ].filter(Boolean),
    financeBreakdown,
    topSchools: highlightedSchools,
    notes: [
      "Official live district data comes from NCES CCD, CRDC, EDFacts, and SAIPE via the Urban Institute Education Data API.",
      "Niche-only category grades, review mixes, popular colleges, and local living grades require opening the linked Niche page when they are not already in the local cache."
    ]
  };
}

function mergeSchoolStats(primary = [], secondary = []) {
  const seen = new Set();
  return [...primary, ...secondary].filter((item) => {
    if (!item?.label || seen.has(item.label)) return false;
    seen.add(item.label);
    return true;
  });
}

function buildSchoolRatingResponse({ geoid, name, state, nicheItems, usNewsItems, officialData }) {
  const primaryNiche =
    nicheItems.find((item) => /niche\.com\/k12\/d\/[^/]+\/?$/i.test(item.url)) || nicheItems[0] || null;
  const rankingNiche = nicheItems.find((item) => /\/rankings\/?$/i.test(item.url)) || null;
  const candidateNicheUrls = nicheDistrictUrls(name, state);
  const sourceUrl = primaryNiche?.url || candidateNicheUrls[0] || "";
  const rankingsUrl = rankingNiche?.url || (sourceUrl ? `${sourceUrl.replace(/\/$/, "")}/rankings/` : "");
  const description = primaryNiche?.description || "";
  const snippetStats = [
    statFromDescription(description, /\bhas\s+([0-9,]+)\s+students\b/i, "Students"),
    statFromDescription(description, /\bgrades\s+(.+?)\s+with\s+a\s+student-teacher/i, "Grades"),
    statFromDescription(description, /\bratio of\s+([0-9.]+\s+to\s+1)\b/i, "Student-teacher ratio"),
    statFromDescription(description, /([0-9.]+%)\s+of students are at least proficient in math/i, "Math proficiency"),
    statFromDescription(description, /([0-9.]+%)\s+in reading/i, "Reading proficiency")
  ].filter(Boolean);

  const usNewsResults = usNewsItems.map((item) => ({
    title: item.title,
    url: item.url,
    description: item.description
  }));
  const official = officialSchoolRatingFields(officialData, name);

  const links = [
    sourceUrl ? { label: "Niche profile", url: sourceUrl } : null,
    rankingsUrl ? { label: "Niche rankings", url: rankingsUrl } : null,
    usNewsResults[0]?.url ? { label: "US News result", url: usNewsResults[0].url } : null,
    { label: "Education Data API", url: "https://educationdata.urban.org/documentation/" },
    { label: "Niche search", url: sourceSearchUrl("Niche", name) },
    { label: "US News search", url: sourceSearchUrl("US News", name) }
  ].filter(Boolean);

  return {
    geoid,
    name: official.name || name,
    state,
    source: officialData ? "Niche / US News / NCES live lookup" : "Live Niche / US News lookup",
    sourceUrl,
    rankingsUrl,
    overallGrade: ratingDescriptor(description) || (primaryNiche ? "Current Niche result" : "Open Niche"),
    rating: primaryNiche ? "Niche result found" : officialData ? "Official district data loaded" : "Source links ready",
    reviewCount: "",
    headlineRank: rankingNiche ? "Niche rankings result found" : "",
    summary:
      description ||
      (officialData
        ? "Niche page links and official NCES/CRDC/EDFacts district data are shown below."
        : "No indexed rating snippet was returned for this district, but the Niche profile, Niche rankings, and US News search links are available below."),
    districtType: official.districtType,
    location: official.location,
    contact: official.contact,
    offerings: official.offerings || [],
    financeBreakdown: official.financeBreakdown || [],
    topSchools: official.topSchools || [],
    stats: mergeSchoolStats(snippetStats, official.stats || []),
    usNewsResults,
    externalLinks: links,
    notes: [
      ...(official.notes || []),
      "Fallback data comes from current indexed result snippets and source links when a district is not in the local cache.",
      "Open Niche or US News for the full current grade, ranking tables, and methodology."
    ]
  };
}

async function loadLiveSchoolRatings(requestUrl) {
  const geoid = requestUrl.searchParams.get("geoid") || "";
  const name = requestUrl.searchParams.get("name") || geoid || "school district";
  const state = requestUrl.searchParams.get("state") || "";
  const cacheKey = `${geoid}:${name}:${state}`.toLowerCase();
  if (schoolRatingsCache.has(cacheKey)) return schoolRatingsCache.get(cacheKey);

  const candidates = schoolNameCandidates(name);
  const queryCandidates = candidates.slice(0, 4);
  const nicheQueries = queryCandidates.map((candidate) => `"${candidate}" site:niche.com/k12/d`);
  const usNewsQueries = queryCandidates.map(
    (candidate) => `"${candidate}" school district (site:usnews.com/education/k12 OR site:usnews.com/education/best-high-schools)`
  );
  const [nicheGroups, usNewsGroups] = await Promise.all([
    Promise.all(nicheQueries.map((query) => bingRssSearch(query))),
    Promise.all(usNewsQueries.map((query) => bingRssSearch(query)))
  ]);
  const nicheRaw = nicheGroups.flat();
  const usNewsRaw = usNewsGroups.flat();
  const nicheItems = bestSourceItems(nicheRaw, candidates, "Niche", 7);
  const usNewsItems = bestSourceItems(usNewsRaw, candidates, "US News", 4);
  const officialData = await loadOfficialSchoolDistrictData(schoolLeaid(geoid));
  const payload = buildSchoolRatingResponse({ geoid, name, state, nicheItems, usNewsItems, officialData });

  if (schoolRatingsCache.size >= maxSchoolRatingsCacheItems) {
    schoolRatingsCache.delete(schoolRatingsCache.keys().next().value);
  }
  schoolRatingsCache.set(cacheKey, payload);
  return payload;
}

function cleanWikiText(value = "") {
  return String(value)
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<ref[\s\S]*?<\/ref>/gi, "")
    .replace(/<ref[^>]*\/>/gi, "")
    .replace(/\{\{efn[^}]*\}\}/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeOfficialParty(party = "") {
  const value = String(party).toLowerCase();
  if (value.includes("republican")) return "Republican";
  if (value.includes("democrat")) return "Democrat";
  if (value.includes("independent")) return "Independent";
  if (value.includes("nonpartisan") || value.includes("non-partisan")) return "Nonpartisan";
  return cleanWikiText(party);
}

function cleanWikiMarkup(value = "") {
  return cleanWikiText(value)
    .replace(/\{\{[^{}|]*\|([^{}]*)\}\}/g, "$1")
    .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, "$1")
    .replace(/\[[^\] ]+\s+([^\]]+)\]/g, "$1")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function wikipediaApiUrl(params) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") url.searchParams.set(key, value);
  }
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  return url;
}

async function fetchJsonWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "urban-area-census-map/1.0"
      }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchTextWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/plain,*/*",
        "User-Agent": "urban-area-census-map/1.0"
      }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function loadWikidataEntity(id) {
  if (!id) return null;
  const payload = await fetchJsonWithTimeout(`https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(id)}.json`);
  return payload.entities?.[id] || null;
}

function wikidataEntityIdFromStatement(statement) {
  return statement?.mainsnak?.datavalue?.value?.id || "";
}

async function wikidataLabel(id) {
  const entity = await loadWikidataEntity(id);
  return entity?.labels?.en?.value || "";
}

async function wikidataParty(entity) {
  const ids = [...new Set((entity?.claims?.P102 || []).map(wikidataEntityIdFromStatement).filter(Boolean))];
  const labels = await Promise.all(ids.slice(0, 3).map(wikidataLabel));
  return normalizeOfficialParty(labels.filter(Boolean).join(", "));
}

async function searchWikidataPerson(name, place = "", state = "") {
  if (!name) return null;
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbsearchentities");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("search", name);
  url.searchParams.set("limit", "12");
  const payload = await fetchJsonWithTimeout(url);
  const normalizedName = String(name).toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const normalizedPlace = String(place).toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const stateName = stateAbbrToName[String(state).toUpperCase()] || "";
  const normalizedState = stateName.toLowerCase();
  const ranked = (payload.search || []).map((item) => {
    const label = String(item.label || "").toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
    const description = String(item.description || "").toLowerCase();
    let score = 0;
    if (label === normalizedName) score += 10;
    if (description.includes("mayor")) score += 5;
    if (description.includes("politician")) score += 3;
    if (normalizedPlace && description.includes(normalizedPlace)) score += 5;
    if (normalizedState && description.includes(normalizedState)) score += 2;
    if (/\b(guitarist|musician|songwriter|athlete|football|basketball|baseball)\b/.test(description)) score -= 8;
    return { item, score };
  }).sort((a, b) => b.score - a.score);
  const result = ranked.find(({ score }) => score >= 10)?.item;
  return result?.id ? loadWikidataEntity(result.id) : null;
}

async function wikipediaWikitext(title) {
  if (!title) return { title: "", text: "" };
  try {
    const payload = await fetchJsonWithTimeout(
      wikipediaApiUrl({
        action: "query",
        prop: "revisions",
        rvprop: "content",
        rvslots: "main",
        titles: title
      })
    );
    const page = Object.values(payload.query?.pages || {})[0] || {};
    const text = page.revisions?.[0]?.slots?.main?.["*"] || "";
    if (text) return { title: page.title || title, text };
  } catch {
    // Fall through to raw wikitext below. Wikimedia's JSON API can rate-limit before raw page fetches do.
  }

  const rawUrl = new URL("https://en.wikipedia.org/w/index.php");
  rawUrl.searchParams.set("title", title);
  rawUrl.searchParams.set("action", "raw");
  const text = await fetchTextWithTimeout(rawUrl).catch(() => "");
  return { title, text };
}

function wikipediaTitleCandidates(name, place, state, preferredTitle) {
  const stateName = stateAbbrToName[String(state).toUpperCase()] || "";
  return uniqueValues([
    preferredTitle,
    name,
    stateName ? `${name} (${stateName} politician)` : "",
    place ? `${name} (${place} politician)` : "",
    `${name} (politician)`
  ]);
}

async function searchWikipediaTitle(name, place, state) {
  const query = [name, "mayor", place, state].filter(Boolean).join(" ");
  const payload = await fetchJsonWithTimeout(
    wikipediaApiUrl({
      action: "query",
      list: "search",
      srsearch: query,
      srlimit: "5"
    })
  );
  const normalizedName = String(name).toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const result = (payload.query?.search || []).find((item) =>
    String(item.title || "").toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim() === normalizedName
  );
  return result?.title || payload.query?.search?.[0]?.title || "";
}

function parsePartyFromWikipedia(wikitext = "") {
  const infobox = String(wikitext).match(/\{\{Infobox[\s\S]*?\n\}\}/i)?.[0] || String(wikitext).slice(0, 12000);
  const partyLine =
    infobox.match(/^\|\s*(?:party|political_party)\s*=\s*([^\n]+)/im)?.[1] ||
    String(wikitext).match(/^\|\s*(?:party|political_party)\s*=\s*([^\n]+)/im)?.[1] ||
    "";
  const currentParty = partyLine
    .split(/<br\s*\/?>|<br>|;|\n/i)
    .find((segment) => /\b(present|current|incumbent)\b/i.test(segment));
  if (currentParty) {
    const normalized = normalizeOfficialParty(cleanWikiMarkup(currentParty));
    if (normalized) return normalized;
  }
  const party = normalizeOfficialParty(cleanWikiMarkup(partyLine));
  if (party) return party;

  if (/\[\[Category:Democratic Party (?:mayors|politicians|members)/i.test(wikitext)) return "Democrat";
  if (/\[\[Category:Republican Party (?:mayors|politicians|members)/i.test(wikitext)) return "Republican";
  if (/\[\[Category:Independent (?:politicians|mayors)/i.test(wikitext)) return "Independent";
  if (/\bnonpartisan\b/i.test(wikitext)) return "Nonpartisan";
  return "";
}

async function loadMayorParty(requestUrl) {
  const name = String(requestUrl.searchParams.get("name") || "").trim();
  const place = String(requestUrl.searchParams.get("place") || "").trim();
  const state = String(requestUrl.searchParams.get("state") || "").trim().toUpperCase();
  const wikidataId = String(requestUrl.searchParams.get("wikidataId") || "").trim();
  const providedTitle = String(requestUrl.searchParams.get("wikipediaTitle") || "").trim();
  const cacheKey = `${name}:${place}:${state}:${wikidataId}:${providedTitle}`.toLowerCase();
  if (mayorPartyCache.has(cacheKey)) return mayorPartyCache.get(cacheKey);

  let entity = wikidataId ? await loadWikidataEntity(wikidataId).catch(() => null) : null;
  if (!entity && name) entity = await searchWikidataPerson(name, place, state).catch(() => null);

  const wikidataPartyValue = await wikidataParty(entity).catch(() => "");
  let party = wikidataPartyValue;
  let title = providedTitle || entity?.sitelinks?.enwiki?.title || name;
  let source = party ? "Wikidata party claim" : "";

  if (title || name) {
    let page = await wikipediaWikitext(title).catch(() => ({ title, text: "" }));
    const wikipediaParty = parsePartyFromWikipedia(page.text);
    let resolvedWikipediaParty = wikipediaParty;

    if (!resolvedWikipediaParty && name) {
      for (const candidateTitle of wikipediaTitleCandidates(name, place, state, title)) {
        if (!candidateTitle || candidateTitle === page.title) continue;
        const candidatePage = await wikipediaWikitext(candidateTitle).catch(() => ({ title: candidateTitle, text: "" }));
        const candidateParty = parsePartyFromWikipedia(candidatePage.text);
        if (candidateParty) {
          page = candidatePage;
          resolvedWikipediaParty = candidateParty;
          break;
        }
      }
    }

    if (!resolvedWikipediaParty && name) {
      const searchTitle = await searchWikipediaTitle(name, place, state).catch(() => "");
      if (searchTitle && searchTitle !== page.title) {
        const searchedPage = await wikipediaWikitext(searchTitle).catch(() => ({ title: searchTitle, text: "" }));
        const searchedParty = parsePartyFromWikipedia(searchedPage.text);
        if (searchedParty) {
          page = searchedPage;
          resolvedWikipediaParty = searchedParty;
        }
      }
    }
    if (resolvedWikipediaParty) {
      party = resolvedWikipediaParty;
      source = "Wikipedia infobox";
    }
    title = page.title || title;
  }

  const payload = {
    name,
    place,
    state,
    party,
    source,
    wikidataId: entity?.id || wikidataId,
    wikipediaTitle: title,
    sourceUrl: title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}` : ""
  };

  if (mayorPartyCache.size >= maxMayorPartyCacheItems) {
    mayorPartyCache.delete(mayorPartyCache.keys().next().value);
  }
  mayorPartyCache.set(cacheKey, payload);
  return payload;
}

function parseGovernorState(row = "") {
  const match = row.match(/\[\[Governor of ([^\]|]+)(?:\|([^\]]+))?\]\]/i);
  const stateName = cleanWikiText(match?.[2] || match?.[1] || "").replace(/^the /i, "");
  return stateNameToAbbr[stateName.toLowerCase()] || "";
}

function parseGovernorName(row = "") {
  const sortName = row.match(/\{\{sortname\|([^|}]+)\|([^|}]+)(?:\|[^}]*)?\}\}/i);
  if (sortName) return cleanWikiText(`${sortName[1]} ${sortName[2]}`);

  const linkedName = row.match(/!\s*scope="row"\s*\|[\s\S]*?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/i);
  return cleanWikiText(linkedName?.[2] || linkedName?.[1] || "");
}

function parseGovernorParty(row = "") {
  const party =
    row.match(/\|\s*\[\[[^\]]*\|?(Republican|Democratic|Democrat|Independent)\]\]/i)?.[1] ||
    row.match(/\b(Republican|Democratic|Democrat|Independent)\b/i)?.[1] ||
    "";
  return normalizeOfficialParty(party);
}

function parseGovernorImage(row = "") {
  const file = row.match(/\[\[(?:File|Image):([^\]|]+)[^\]]*\]\]/i)?.[1] || "";
  return file ? commonsFileUrl.replace("{file}", encodeURIComponent(cleanWikiText(file))) : "";
}

function parseGovernorUrl(row = "") {
  return row.match(/\|url=(https:\/\/www\.nga\.org\/governors\/[^ |\n}]+)/i)?.[1] || "";
}

function fallbackGovernorMap() {
  return Object.fromEntries(
    Object.entries(fallbackGovernors).map(([abbr, governor]) => [
      abbr,
      {
        ...governor,
        state: abbr,
        stateName: stateAbbrToName[abbr],
        links: [{ label: "National Governors Association", url: `https://www.nga.org/governors/${stateAbbrToName[abbr].toLowerCase().replace(/\s+/g, "-")}/` }],
        source: "Bundled governor fallback"
      }
    ])
  );
}

function parseCurrentGovernors(wikitext = "") {
  const marker = "|+ Current state governors of the United States";
  const table = String(wikitext).split(marker)[1]?.split("==Territory governors==")[0] || "";
  const rows = table.split(/\n\|-[^\n]*\n/g);
  const governors = fallbackGovernorMap();

  for (const row of rows) {
    const abbr = parseGovernorState(row);
    if (!abbr) continue;

    const name = parseGovernorName(row);
    const party = parseGovernorParty(row);
    if (!name || !party) continue;

    const url = parseGovernorUrl(row);
    governors[abbr] = {
      name,
      party,
      image: parseGovernorImage(row),
      state: abbr,
      stateName: stateAbbrToName[abbr],
      links: url ? [{ label: "National Governors Association", url }] : governors[abbr]?.links || [],
      source: "Wikipedia current governors"
    };
  }

  return governors;
}

async function loadCurrentGovernors() {
  const now = Date.now();
  if (governorCache && now - governorCacheLoadedAt < governorCacheMs) return governorCache;
  if (governorCacheLoading) return governorCacheLoading;

  governorCacheLoading = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(currentGovernorsUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "urban-area-census-map/1.0"
        }
      });
      if (!response.ok) throw new Error("Current governors request failed");
      const payload = await response.json();
      const parsed = parseCurrentGovernors(payload.parse?.wikitext?.["*"] || "");
      governorCache = parsed;
      governorCacheLoadedAt = now;
      return parsed;
    } finally {
      clearTimeout(timeout);
      governorCacheLoading = null;
    }
  })().catch((error) => {
    governorCacheLoading = null;
    if (!governorCache) governorCache = fallbackGovernorMap();
    return { ...governorCache, _error: error.message };
  });

  return governorCacheLoading;
}

async function loadStateOfficials(requestUrl) {
  const requestedState = String(requestUrl.searchParams.get("state") || "").trim().toUpperCase();
  const governors = await loadCurrentGovernors();
  const governor = requestedState ? governors[requestedState] || null : null;
  return {
    source: "Wikipedia current governors",
    state: requestedState || null,
    governor,
    governors,
    error: governors._error || ""
  };
}

function sendJson(response, status, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Content-Length": body.length,
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(body);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }

  if (new URL(request.url, `http://127.0.0.1:${port}`).pathname.startsWith(mapboxProxyPrefix)) {
    try {
      await proxyMapboxRequest(request, response);
    } catch {
      response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" }).end("Mapbox proxy failed");
    }
    return;
  }

  const pathname = new URL(request.url, `http://127.0.0.1:${port}`).pathname;

  if (pathname.startsWith(googleSatelliteProxyPrefix)) {
    try {
      await proxyGoogleSatelliteRequest(request, response);
    } catch {
      sendTransparentTile(response);
    }
    return;
  }

  if (pathname === googleMapsConfigApiPath) {
    const apiKey = googleMapsApiKey();
    sendJson(response, 200, {
      available: Boolean(apiKey),
      satelliteAvailable: Boolean(apiKey),
      threeDAvailable: Boolean(apiKey),
      apiKey,
      source: "Google Maps Platform Map Tiles API"
    });
    return;
  }

  if (pathname === schoolRatingsApiPath) {
    try {
      const payload = await loadLiveSchoolRatings(new URL(request.url, `http://127.0.0.1:${port}`));
      sendJson(response, 200, payload);
    } catch {
      sendJson(response, 200, {
        source: "School ratings lookup",
        overallGrade: "Live lookup",
        summary: "Open the source links for current ratings.",
        stats: [],
        usNewsResults: [],
        externalLinks: []
      });
    }
    return;
  }

  if (pathname === stateOfficialsApiPath) {
    try {
      const payload = await loadStateOfficials(new URL(request.url, `http://127.0.0.1:${port}`));
      sendJson(response, 200, payload);
    } catch (error) {
      sendJson(response, 200, {
        source: "Current state officials",
        governor: null,
        governors: fallbackGovernorMap(),
        error: error.message
      });
    }
    return;
  }

  if (pathname === mayorPartyApiPath) {
    try {
      const payload = await loadMayorParty(new URL(request.url, `http://127.0.0.1:${port}`));
      sendJson(response, 200, payload);
    } catch (error) {
      sendJson(response, 200, {
        party: "",
        source: "",
        error: error.message
      });
    }
    return;
  }

  if (pathname.startsWith(opportunityAtlasProxyPrefix)) {
    try {
      await proxyRemoteDataRequest(request, response, opportunityAtlasProxyPrefix, "https://data-v1.opportunityatlas.org/");
    } catch {
      response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" }).end("Opportunity Atlas proxy failed");
    }
    return;
  }

  if (pathname.startsWith(censusOpportunityProxyPrefix)) {
    try {
      await proxyRemoteDataRequest(request, response, censusOpportunityProxyPrefix, "https://www2.census.gov/ces/opportunity/");
    } catch {
      response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" }).end("Census opportunity data proxy failed");
    }
    return;
  }

  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");

    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
      "Content-Length": fileStat.size,
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
});
