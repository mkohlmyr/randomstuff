const MEAN_EARTH_RADIUS_KM = 6371;

const rad = deg => (deg * Math.PI) / 180;

export class Coordinates {
  constructor({ lat, lon }) {
    this.lat = rad(lat);
    this.lon = rad(lon);
  }
}

export function distance(p, q) {
  const dx = q.lat - p.lat;
  const dy = q.lon - p.lon;
  const sx = Math.pow(Math.sin(dx / 2), 2);
  const sy = Math.pow(Math.sin(dy / 2), 2);
  const ca = Math.cos(p.lat);
  const cb = Math.cos(q.lat);

  const a = sx + (sy * ca * cb);
  const arcsin = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return 2 * MEAN_EARTH_RADIUS_KM * arcsin;
}