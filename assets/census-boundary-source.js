(function (root) {
  const TIGER_SERVICE = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2024/MapServer";
  const TIGER_LAYERS = {
    "010": [], "020": [62], "030": [60], "040": [80], "050": [82], "060": [22],
    "140": [8], "150": [10], "160": [28, 30], "252": [36, 38, 40],
    "310": [93, 91], "330": [97], "400": [88], "500": [54], "610": [56],
    "620": [58], "795": [0], "860": [2], "970": [14]
  };
  const PAGE_SIZE = 1000;
  const pending = [];
  let activeRequests = 0;
  let primaryRetryAt = 0;

  function schedule(request) {
    return new Promise((resolve, reject) => {
      pending.push({ request, resolve, reject });
      drain();
    });
  }

  function drain() {
    while (activeRequests < 4 && pending.length) {
      const job = pending.shift();
      activeRequests += 1;
      Promise.resolve().then(job.request).then(job.resolve, job.reject).finally(() => {
        activeRequests -= 1;
        drain();
      });
    }
  }

  function retryDelay(response) {
    const value = response.headers.get("retry-after");
    if (!value) return 120000;
    const seconds = Number(value);
    return Number.isFinite(seconds) ? seconds * 1000 : Math.max(0, Date.parse(value) - Date.now()) || 120000;
  }

  async function readResponse(url, kind, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        const error = new Error(`Boundary request failed (${response.status})`);
        error.status = response.status;
        error.retryDelay = retryDelay(response);
        throw error;
      }
      return await response[kind]();
    } finally {
      clearTimeout(timer);
    }
  }

  function fallbackUrl(layer, extent, resolution, offset) {
    const params = new URLSearchParams({
      f: "json",
      where: "1=1",
      geometry: extent.join(","),
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      inSR: "3857",
      outSR: "3857",
      outFields: "GEOID,NAME",
      returnGeometry: "true",
      maxAllowableOffset: String(Math.max(0.25, resolution / 4)),
      geometryPrecision: "2",
      orderByFields: "GEOID",
      resultRecordCount: String(PAGE_SIZE),
      resultOffset: String(offset)
    });
    return `${TIGER_SERVICE}/${layer}/query?${params}`;
  }

  async function readFallbackLayer(format, layer, request) {
    const features = [];
    let offset = 0;
    for (let page = 0; page < 100; page += 1) {
      const url = fallbackUrl(layer, request.extent, request.resolution, offset);
      const payload = await readResponse(url, "json", 15000);
      if (payload.error || !Array.isArray(payload.features)) {
        throw new Error(payload.error?.message || "Invalid Census boundary response");
      }
      features.push(...format.readFeatures(payload, {
        dataProjection: "EPSG:3857", featureProjection: request.projection
      }));
      offset += payload.features.length;
      if (!payload.exceededTransferLimit) return features;
      if (!payload.features.length) throw new Error("Incomplete Census boundary response");
    }
    throw new Error("Census boundary pagination did not finish");
  }

  let nationRequest;
  async function readFallback(formats, sumlevel, request) {
    if (sumlevel === "010") {
      nationRequest ??= readResponse("https://api.censusreporter.org/1.0/geo/tiger2024/01000US?geom=true", "json", 15000)
        .catch((error) => { nationRequest = null; throw error; });
      return formats.geojson.readFeatures(await nationRequest, {
        dataProjection: "EPSG:4326", featureProjection: request.projection
      });
    }
    const features = [];
    for (const layer of TIGER_LAYERS[sumlevel]) {
      features.push(...await readFallbackLayer(formats.esri, layer, request));
    }
    return features;
  }

  async function loadGeometry(geoid) {
    const match = /^(\d{3})00US([\dA-Z]*)$/.exec(geoid);
    const layers = match && TIGER_LAYERS[match[1]];
    if (!layers?.length) throw new Error(`No Census geometry fallback for ${geoid}`);
    for (const layer of layers) {
      const params = new URLSearchParams({
        f: "geojson", where: `GEOID='${match[2]}'`, outFields: "GEOID,NAME,AREALAND,AREAWATER",
        returnGeometry: "true", outSR: "4326"
      });
      const result = await readResponse(`${TIGER_SERVICE}/${layer}/query?${params}`, "json", 15000);
      if (result.error || !Array.isArray(result.features)) throw new Error("Invalid Census geometry response");
      const feature = result.features[0];
      if (!feature?.geometry) continue;
      const properties = feature.properties;
      return { ...feature, properties: {
        ...properties, full_geoid: geoid, display_name: properties.NAME,
        aland: properties.AREALAND, awater: properties.AREAWATER
      } };
    }
    throw new Error(`Census boundary not found for ${geoid}`);
  }

  async function loadFeatures(formats, sumlevel, request) {
    if (Date.now() >= primaryRetryAt) {
      try {
        const bytes = await readResponse(request.url, "arrayBuffer", 8000);
        return formats.mvt.readFeatures(bytes, {
          extent: request.extent, featureProjection: request.projection
        });
      } catch (error) {
        // A blocked/rate-limited provider must not be hit again for every visible tile.
        const delay = error.status === 429 ? error.retryDelay : error.status === 403 ? 300000 : 30000;
        primaryRetryAt = Math.max(primaryRetryAt, Date.now() + delay);
      }
    }
    return readFallback(formats, sumlevel, request);
  }

  function createSource(ol, { sumlevel, url, cacheSize = 192 }) {
    if (!(sumlevel in TIGER_LAYERS)) throw new Error(`Unsupported Census boundaries: ${sumlevel}`);
    const formats = { mvt: new ol.format.MVT(), esri: new ol.format.EsriJSON(), geojson: new ol.format.GeoJSON() };
    return new ol.source.VectorTile({
      format: formats.mvt, url, maxZoom: 14, transition: 0, cacheSize, wrapX: false,
      attributions: 'Boundaries: <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html">U.S. Census Bureau</a>, <a href="https://censusreporter.org/">Census Reporter</a>',
      tileLoadFunction(tile, tileUrl) {
        tile.setLoader((extent, resolution, projection) => {
          const request = { url: tileUrl, extent, resolution, projection };
          schedule(() => loadFeatures(formats, sumlevel, request))
            .then((features) => tile.setFeatures(features))
            .catch((error) => {
              tile.setState(3);
              console.warn("Census boundary tile could not be loaded", tileUrl, error);
            });
        });
      }
    });
  }

  const api = { createSource, loadGeometry };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CensusBoundarySource = api;
})(globalThis);
