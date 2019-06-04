import { Coordinates, distance, DUBLIN } from './geography.mjs';

export const RADIUS = 100;

export function filter(records) {
  return records.filter(r => distance(DUBLIN, new Coordinates(r)) < RADIUS);
}

export function transform(records) {
  return records.map(({ user_id, name }) => ({ user_id, name }));
}

export function sort(records) {
  return records.sort(compare);
}

export function compare(a, b) {
  return a.user_id - b.user_id;
}
