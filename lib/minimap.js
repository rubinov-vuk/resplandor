// Mini map at the top of a story: the country, its region filled in, and a pin on the place.
// Outlines come from Natural Earth (public domain), trimmed to the Americas in geo/americas.json.
import { readFileSync } from "node:fs";

const geo = JSON.parse(readFileSync(new URL("../geo/americas.json", import.meta.url), "utf8"));

// Country names used in the editor → country codes in the map data.
// To map a new country, add its name here with the code (Mexico MEX, Ecuador ECU, Jamaica JAM, ...).
const CODES = {
  Kanada: "CAN", SAD: "USA", Meksiko: "MEX", Gvatemala: "GTM", Belize: "BLZ", Honduras: "HND",
  Salvador: "SLV", Nikaragva: "NIC", Kostarika: "CRI", Panama: "PAN", Kuba: "CUB", Jamajka: "JAM",
  Kolumbija: "COL", Venecuela: "VEN", Ekvador: "ECU", Peru: "PER", Bolivija: "BOL", Brazil: "BRA",
  Paragvaj: "PRY", Urugvaj: "URY", Argentina: "ARG", "Čile": "CHL",
};

const bboxOf = (rings) => {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of rings[0]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return [x0, y0, x1, y1];
};
const inRing = ([x, y], ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inPoly = (pt, rings) => inRing(pt, rings[0]) && !rings.slice(1).some((r) => inRing(pt, r));

// "-13.4192, -71.8476" (as copied from Google Maps) → [lon, lat]
function parseCoords(text) {
  const nums = String(text || "").match(/-?\d+(?:\.\d+)?/g);
  if (!nums || nums.length < 2) return null;
  const [lat, lon] = nums.map(Number);
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? [lon, lat] : null;
}

export function miniMap(country, coordsText, location) {
  const code = CODES[country];
  const shape = code && geo.countries[code];
  if (!shape || !shape.length) return null;
  const pt = parseCoords(coordsText);

  // Frame the part of the country the place is in (mainland USA rather than Alaska, etc.).
  const focus = (pt && shape.find((p) => inPoly(pt, p))) ||
    shape.reduce((a, b) => { const A = bboxOf(a), B = bboxOf(b); return (B[2] - B[0]) * (B[3] - B[1]) > (A[2] - A[0]) * (A[3] - A[1]) ? b : a; });
  let [x0, y0, x1, y1] = bboxOf(focus);
  if (pt) { x0 = Math.min(x0, pt[0]); x1 = Math.max(x1, pt[0]); y0 = Math.min(y0, pt[1]); y1 = Math.max(y1, pt[1]); }
  const k = Math.cos((((y0 + y1) / 2) * Math.PI) / 180); // keeps shapes from looking stretched
  const cx = ((x0 + x1) / 2) * k, cy = -(y0 + y1) / 2;
  const size = Math.max((x1 - x0) * k, y1 - y0, 2.5) * 1.12;
  const left = cx - size / 2, top = cy - size / 2;
  const P = ([lon, lat]) => [((lon * k - left) / size) * 100, ((-lat - top) / size) * 100];

  const visible = (rings) => {
    const [a, b, c, d] = bboxOf(rings).map((v, i) => (i % 2 ? -v : v * k));
    return c >= left && a <= left + size && b >= top && d <= top + size;
  };
  const path = (polys) => polys.filter(visible).map((rings) => rings.map((ring) => {
    let last = "";
    const pts = [];
    for (const p of ring) {
      const [x, y] = P(p).map((v) => v.toFixed(1));
      const s = `${x} ${y}`;
      if (s !== last) pts.push(s), (last = s);
    }
    return pts.length > 2 ? `M${pts.join("L")}Z` : "";
  }).join("")).join("");

  const others = Object.entries(geo.countries).filter(([c]) => c !== code).flatMap(([, p]) => p);
  const regions = geo.regions.filter((r) => r.c === code);
  // The region the place is in; for places right on the coast (outlines are simplified),
  // the closest region within about 30 km.
  const nearest = () => {
    let best = null, bestD = 0.3;
    for (const r of regions) for (const p of r.p) for (const [x, y] of p[0]) {
      const d = Math.hypot(x - pt[0], y - pt[1]);
      if (d < bestD) (bestD = d), (best = r);
    }
    return best;
  };
  const region = pt && (regions.find((r) => r.p.some((p) => inPoly(pt, p))) || nearest());

  let pin = "";
  if (pt) {
    const [x, y] = P(pt).map((v) => v.toFixed(1));
    pin = `<circle class="map-pin-ring" cx="${x}" cy="${y}" r="4.2"/><circle class="map-pin" cx="${x}" cy="${y}" r="1.7"/>`;
  }
  const svg = `<svg class="map" viewBox="0 0 100 100" role="img" aria-label="${country}${region ? ", " + region.n : ""}">` +
    `<path class="map-others" d="${path(others)}"/>` +
    `<path class="map-country" d="${path(shape)}"/>` +
    `<path class="map-regions" d="${path(regions.flatMap((r) => r.p))}"/>` +
    (region ? `<path class="map-region" d="${path(region.p)}"/>` : "") +
    `<path class="map-outline" d="${path(shape)}"/>` + pin + `</svg>`;

  const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;
  return {
    svg,
    region: region ? region.n : "",
    place: String(location || "").split(",")[0].trim(),
    coords: pt ? `${fmt(pt[1], "S", "J")}, ${fmt(pt[0], "I", "Z")}` : "",
  };
}
