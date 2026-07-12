const express = require("express");
const axios = require("axios");
const router = express.Router();

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const PHOTON_REVERSE_URL = "https://photon.komoot.io/reverse";
const USER_AGENT = "SportMate/1.0";

// Search farther away until enough fields are found.
const MIN_FIELDS = 4;
const SEARCH_RADII = [2000, 5000, 10000, 20000, 35000, 50000];
const MAX_SEARCH_RADIUS = SEARCH_RADII[SEARCH_RADII.length - 1];
const DUP_METERS = 120;

const SPORT_TAGS = {
  Football: ["football", "soccer"],
  Basketball: ["basketball"],
  Tennis: ["tennis"],
};
const SUPPORTED_SPORT_FILTER = Object.values(SPORT_TAGS).flat().join("|");

const SPORT_CONFIG = {
  Football: { label: "כדורגל", icon: "⚽" },
  Basketball: { label: "כדורסל", icon: "🏀" },
  Tennis: { label: "טניס", icon: "🎾" },
};

const reverseCache = new Map();
const overpassCache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

const toNum = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
};

// Measure the direct distance between coordinates.
function haversineKm(aLat, aLng, bLat, bLng) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function isClose(a, b) {
  return haversineKm(a.lat, a.lng, b.lat, b.lng) * 1000 <= DUP_METERS;
}

// Remove duplicate nearby fields.
function dedupe(list) {
  const out = [];
  for (const item of list) {
    if (!out.some((x) => x.sport === item.sport && isClose(x, item))) {
      out.push(item);
    }
  }
  return out;
}

function pickSport(tags) {
  for (const [k, arr] of Object.entries(SPORT_TAGS)) {
    if (arr.some((v) => String(tags.sport || "").includes(v))) return k;
  }
  return null;
}

function buildAddress(tags) {
  const full = tags["addr:full"] || tags["contact:address"] || "";
  const city = tags["addr:city:he"] || tags["addr:city"] || "";
  const street = tags["addr:street:he"] || tags["addr:street"] || "";
  const house = tags["addr:housenumber"] || "";
  const result = `${street} ${house} ${city}`.trim();
  return full || result || "";
}

// Find a readable address for coordinates.
async function reverseGeocode(lat, lng) {
  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (reverseCache.has(key)) return reverseCache.get(key);

  try {
    const { data } = await axios.get(NOMINATIM_REVERSE_URL, {
      params: {
        lat,
        lon: lng,
        format: "json",
        zoom: 18,
        "accept-language": "he,en",
      },
      headers: { "User-Agent": USER_AGENT },
      timeout: 4000,
    });

    const a = data?.address || {};
    const txt =
      `${a.road || ""} ${a.house_number || ""} ${a.city || a.town || a.village || ""}`.trim() ||
      data?.display_name ||
      "כתובת לא ידועה";

    reverseCache.set(key, txt);
    return txt;
  } catch {
    try {
      const { data } = await axios.get(PHOTON_REVERSE_URL, {
        params: { lat, lon: lng },
        headers: { "User-Agent": USER_AGENT },
        timeout: 4000,
      });

      const p = data?.features?.[0]?.properties || {};
      const street = `${p.street || ""} ${p.housenumber || ""}`.trim();
      const place = p.city || p.district || p.county || p.state || p.name || "";
      const text = `${street} ${place}`.trim() || "כתובת לא ידועה";
      reverseCache.set(key, text);
      return text;
    } catch {
      return "כתובת לא ידועה";
    }
  }
}

async function fillMissingAddresses(items) {
  const missing = items.filter((item) => !item.address);

  for (const item of missing) {
    item.address = await reverseGeocode(item.lat, item.lng);
  }
}

// Request sports fields from OpenStreetMap.
async function queryOverpass(lat, lng, radius, sportFilter) {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)},${radius},${sportFilter}`;
  
  const cached = overpassCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Overpass] CACHE HIT radius=${radius}m -> ${cached.data.length} results`);
    return cached.data;
  }

  const query = sportFilter === "All" 
    ? `
[out:json][timeout:20];
(
  node(around:${radius},${lat},${lng})["leisure"="pitch"]["sport"];
  way(around:${radius},${lat},${lng})["leisure"="pitch"]["sport"];
  node(around:${radius},${lat},${lng})["leisure"="sports_centre"]["sport"];
  way(around:${radius},${lat},${lng})["leisure"="sports_centre"]["sport"];
);
out center tags;
`
    : `
[out:json][timeout:20];
(
  node(around:${radius},${lat},${lng})["leisure"="pitch"]["sport"~"${sportFilter}"];
  way(around:${radius},${lat},${lng})["leisure"="pitch"]["sport"~"${sportFilter}"];
  node(around:${radius},${lat},${lng})["leisure"="sports_centre"]["sport"~"${sportFilter}"];
  way(around:${radius},${lat},${lng})["leisure"="sports_centre"]["sport"~"${sportFilter}"];
);
out center tags;
`;

  let lastError;

  for (const url of OVERPASS_URLS) {
    try {
      const start = Date.now();
      console.log(`[Overpass] Querying radius=${radius}m via ${new URL(url).host}`);

      const { data } = await axios.post(url, query, {
        headers: { "Content-Type": "text/plain", "User-Agent": USER_AGENT },
        timeout: 10000,
      });

      const elements = data?.elements || [];
      console.log(
        `[Overpass] radius=${radius}m -> ${elements.length} elements (${Date.now() - start}ms)`
      );

      overpassCache.set(cacheKey, { data: elements, timestamp: Date.now() });

      if (overpassCache.size > 50) {
        const firstKey = overpassCache.keys().next().value;
        overpassCache.delete(firstKey);
      }

      return elements;
    } catch (error) {
      lastError = error;
      console.error(
        `[Overpass] ${new URL(url).host} failed at radius=${radius}m: ${error.message}`
      );
    }
  }

  throw new Error(`All Overpass providers failed: ${lastError?.message || "unknown error"}`);
}

// Return nearby fields for the selected sport.
router.get("/fields", async (req, res) => {
  const t0 = Date.now();

  try {
    const searchLat = toNum(req.query.lat);
    const searchLng = toNum(req.query.lng);
    
    if (searchLat == null || searchLng == null) {
      console.error("[FIELDS] Invalid coordinates:", req.query);
      return res.status(400).json({ error: "Invalid location" });
    }

    const userLat = toNum(req.query.userLat) || searchLat;
    const userLng = toNum(req.query.userLng) || searchLng;

    const sport = req.query.sport || "All";
    
    console.log(`[FIELDS] Request: search=(${searchLat.toFixed(4)}, ${searchLng.toFixed(4)}), user=(${userLat.toFixed(4)}, ${userLng.toFixed(4)}), sport=${sport}`);

    const requestedRadiusIndex = Number.parseInt(req.query.pageToken, 10);
    const isLoadMore = Number.isInteger(requestedRadiusIndex);
    const startIndex = isLoadMore
      ? Math.min(Math.max(requestedRadiusIndex, 0), SEARCH_RADII.length - 1)
      : 0;
    let allFields = [];
    let usedRadiusIndex = startIndex;
    let providerUnavailable = false;

    for (let radiusIndex = startIndex; radiusIndex < SEARCH_RADII.length; radiusIndex += 1) {
      const radius = SEARCH_RADII[radiusIndex];
      usedRadiusIndex = radiusIndex;
      console.log(`[FIELDS] Trying radius ${radius}m`);
      
      let elements;
      try {
        elements = await queryOverpass(
          searchLat,
          searchLng,
          radius,
          SUPPORTED_SPORT_FILTER
        );
      } catch (error) {
        providerUnavailable = true;
        console.error(`[FIELDS] Keeping previous results after radius ${radius}m failed`);
        if (isLoadMore) break;
        continue;
      }
      
      if (!elements || elements.length === 0) {
        console.log(`[FIELDS] radius ${radius}m → 0 results`);
        if (isLoadMore) break;
        continue;
      }

      console.log(`[FIELDS] Processing ${elements.length} raw elements...`);

      const processed = elements
        .map((el) => {
          const plat = toNum(el.lat ?? el.center?.lat);
          const plng = toNum(el.lon ?? el.center?.lon);
          
          if (!plat || !plng) return null;

          const tags = el.tags || {};
          
          if (!tags.sport) return null;

          const sportType = pickSport(tags);
          if (!sportType || (sport !== "All" && sportType !== sport)) return null;
          const cfg = SPORT_CONFIG[sportType];

          const distanceKm = haversineKm(userLat, userLng, plat, plng);

          return {
            id: `${el.type || "node"}-${el.id}`,
            sport: sportType,
            sportIcon: cfg.icon,
            name: tags["name:he"] || tags.name || `מגרש ${cfg.label}`,
            address: buildAddress(tags),
            lat: plat,
            lng: plng,
            distanceKm,
          };
        })
        .filter(Boolean);

      console.log(`[FIELDS] After filtering: ${processed.length} valid fields`);

      processed.sort((a, b) => a.distanceKm - b.distanceKm);

      const deduped = dedupe(processed);
      console.log(`[FIELDS] After deduplication: ${deduped.length} unique fields`);

      allFields = deduped;

      if (!isLoadMore && deduped.length >= MIN_FIELDS) {
        for (let candidateIndex = 0; candidateIndex <= radiusIndex; candidateIndex += 1) {
          const candidateRadius = SEARCH_RADII[candidateIndex];
          const fieldsInsideCandidate = deduped.filter(
            (field) =>
              haversineKm(searchLat, searchLng, field.lat, field.lng) * 1000 <= candidateRadius
          );

          console.log(
            `[FIELDS] Verified radius ${candidateRadius}m -> ${fieldsInsideCandidate.length} matching fields`
          );

          if (fieldsInsideCandidate.length >= MIN_FIELDS) {
            allFields = fieldsInsideCandidate;
            usedRadiusIndex = candidateIndex;
            if (candidateIndex < radiusIndex) {
              console.log(
                `[FIELDS] Recovered false empty radius: ${candidateRadius}m using ${radius}m response`
              );
            }
            break;
          }
        }
      }

      if (isLoadMore || allFields.length >= MIN_FIELDS) break;
    }

    if (allFields.length > 0) {
      const items = isLoadMore ? allFields : allFields.slice(0, MIN_FIELDS);
      await fillMissingAddresses(items);

      console.log(`[FIELDS] Success: ${items.length} fields, closest=${items[0].name} (${items[0].distanceKm.toFixed(2)}km), time=${Date.now() - t0}ms`);

      return res.json({
        items,
        nextPageToken: usedRadiusIndex < SEARCH_RADII.length - 1
          ? String(usedRadiusIndex + 1)
          : null,
        searchRadius: SEARCH_RADII[usedRadiusIndex],
        limitReached: SEARCH_RADII[usedRadiusIndex] === MAX_SEARCH_RADIUS,
        providerUnavailable,
      });
    }

    console.log(`[FIELDS] No results found, time=${Date.now() - t0}ms`);

    res.json({
      items: [],
      nextPageToken: usedRadiusIndex < SEARCH_RADII.length - 1
        ? String(usedRadiusIndex + 1)
        : null,
      searchRadius: SEARCH_RADII[usedRadiusIndex],
      limitReached: SEARCH_RADII[usedRadiusIndex] === MAX_SEARCH_RADIUS,
      providerUnavailable,
    });

  } catch (err) {
    console.error("[FIELDS] FATAL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
