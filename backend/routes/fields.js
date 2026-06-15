const express = require("express");
const axios = require("axios");
const router = express.Router();

/* ---------------- CONFIG ---------------- */
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "SportMate/1.0";

const PAGE_SIZE = 4;
const DUP_METERS = 120;

const SPORT_TAGS = {
  Football: ["football", "soccer"],
  Basketball: ["basketball"],
  Tennis: ["tennis"],
};

const SPORT_CONFIG = {
  Football: { label: "כדורגל", icon: "⚽" },
  Basketball: { label: "כדורסל", icon: "🏀" },
  Tennis: { label: "טניס", icon: "🎾" },
};

const reverseCache = new Map();
const overpassCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/* ---------------- HELPERS ---------------- */
const toNum = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
};

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

function dedupe(list) {
  const out = [];
  for (const item of list) {
    if (!out.some((x) => x.sport === item.sport && isClose(x, item))) {
      out.push(item);
    }
  }
  return out;
}

function pickSport(tags, requested) {
  if (requested !== "All" && SPORT_TAGS[requested]) return requested;
  for (const [k, arr] of Object.entries(SPORT_TAGS)) {
    if (arr.some((v) => String(tags.sport || "").includes(v))) return k;
  }
  return "Football";
}

function buildAddress(tags) {
  const city = tags["addr:city:he"] || tags["addr:city"] || "";
  const street = tags["addr:street:he"] || tags["addr:street"] || "";
  const house = tags["addr:housenumber"] || "";
  const result = `${street} ${house} ${city}`.trim();
  return result || "";
}

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
      timeout: 5000,
    });

    const a = data?.address || {};
    const txt =
      `${a.road || ""} ${a.house_number || ""} ${a.city || a.town || a.village || ""}`.trim() ||
      "כתובת לא ידועה";

    reverseCache.set(key, txt);
    return txt;
  } catch {
    return "כתובת לא ידועה";
  }
}

/* ---------------- OVERPASS ---------------- */
async function queryOverpass(lat, lng, radius, sportFilter) {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)},${radius},${sportFilter}`;
  
  const cached = overpassCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Overpass] CACHE HIT radius=${radius}m -> ${cached.data.length} results`);
    return cached.data;
  }

  // Simplified query - search for any sport field first
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

  try {
    const start = Date.now();
    console.log(`[Overpass] Querying radius=${radius}m, sport=${sportFilter}`);
    
    const { data } = await axios.post(OVERPASS_URL, query, {
      headers: { "Content-Type": "text/plain", "User-Agent": USER_AGENT },
      timeout: 25000,
    });

    const elements = data?.elements || [];
    const elapsed = Date.now() - start;
    
    console.log(`[Overpass] radius=${radius}m -> ${elements.length} elements (${elapsed}ms)`);

    overpassCache.set(cacheKey, {
      data: elements,
      timestamp: Date.now(),
    });

    if (overpassCache.size > 50) {
      const firstKey = overpassCache.keys().next().value;
      overpassCache.delete(firstKey);
    }

    return elements;
  } catch (err) {
    console.error(`[Overpass] ERROR radius=${radius}m: ${err.message}`);
    return [];
  }
}

/* ---------------- ROUTE ---------------- */
router.get("/fields", async (req, res) => {
  const t0 = Date.now();

  try {
    // Parse coordinates
    const searchLat = toNum(req.query.lat);
    const searchLng = toNum(req.query.lng);
    
    if (searchLat == null || searchLng == null) {
      console.error("[FIELDS] Invalid coordinates:", req.query);
      return res.status(400).json({ error: "Invalid location" });
    }

    // User's actual location for distance (fallback to search location)
    const userLat = toNum(req.query.userLat) || searchLat;
    const userLng = toNum(req.query.userLng) || searchLng;

    const sport = req.query.sport || "All";
    
    // Build sport filter for Overpass
    let sportFilter = "All";
    if (sport !== "All" && SPORT_TAGS[sport]) {
      sportFilter = SPORT_TAGS[sport].join("|");
    } else if (sport === "All") {
      sportFilter = "All";
    }

    console.log(`[FIELDS] Request: search=(${searchLat.toFixed(4)}, ${searchLng.toFixed(4)}), user=(${userLat.toFixed(4)}, ${userLng.toFixed(4)}), sport=${sport}`);

    // Progressive radius search
    const radii = [2000, 5000, 10000];
    let allFields = [];

    for (const radius of radii) {
      console.log(`[FIELDS] Trying radius ${radius}m`);
      
      const elements = await queryOverpass(searchLat, searchLng, radius, sportFilter);
      
      if (!elements || elements.length === 0) {
        console.log(`[FIELDS] radius ${radius}m → 0 results`);
        continue;
      }

      console.log(`[FIELDS] Processing ${elements.length} raw elements...`);

      // Process elements
      const processed = elements
        .map((el) => {
          const plat = toNum(el.lat ?? el.center?.lat);
          const plng = toNum(el.lon ?? el.center?.lon);
          
          if (!plat || !plng) return null;

          const tags = el.tags || {};
          
          // Skip if no sport tag
          if (!tags.sport) return null;

          const sportType = pickSport(tags, sport);
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

      // Sort by distance from USER
      processed.sort((a, b) => a.distanceKm - b.distanceKm);

      // Deduplicate
      const deduped = dedupe(processed);
      console.log(`[FIELDS] After deduplication: ${deduped.length} unique fields`);

      // If we have any results, use them
      if (deduped.length > 0) {
        allFields = deduped;
        break; // Stop searching further radii
      }
    }

    // Return up to PAGE_SIZE results
    if (allFields.length > 0) {
      const items = allFields.slice(0, PAGE_SIZE);

      // Reverse geocode missing addresses
      for (const f of items) {
        if (!f.address || f.address === "") {
          f.address = await reverseGeocode(f.lat, f.lng);
        }
      }

      console.log(`[FIELDS] Success: ${items.length} fields, closest=${items[0].name} (${items[0].distanceKm.toFixed(2)}km), time=${Date.now() - t0}ms`);

      return res.json({ items, nextPageToken: null });
    }

    console.log(`[FIELDS] No results found, time=${Date.now() - t0}ms`);

    res.json({ items: [], nextPageToken: null });

  } catch (err) {
    console.error("[FIELDS] FATAL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;