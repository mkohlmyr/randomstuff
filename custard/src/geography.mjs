const MEAN_EARTH_RADIUS = 6371;

const rad = deg => (deg * Math.PI) / 180;

export class Coordinates {
  constructor({ latitude, longitude }) {
    this.latitude = rad(latitude);
    this.longitude = rad(longitude);
  }
}

export function distance(p, q) {
  const dx = q.latitude - p.latitude;
  const dy = q.longitude - p.longitude;
  const sx = Math.pow(Math.sin(dx / 2), 2);
  const sy = Math.pow(Math.sin(dy / 2), 2);
  const ca = Math.cos(p.latitude);
  const cb = Math.cos(q.latitude);

  const a = sx + (sy * ca * cb);
  const arcsin = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return 2 * MEAN_EARTH_RADIUS * arcsin;
}

export const DUBLIN = new Coordinates(
  {
    latitude: 53.339428,
    longitude: -6.257664,
  }
);
