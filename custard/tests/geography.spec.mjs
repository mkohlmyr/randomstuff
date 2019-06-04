import { distance, Coordinates } from '../src/geography.mjs';
import { expect } from 'chai';

const KINGS_CROSS = new Coordinates(
  {
    latitude: 51.530453,
    longitude: -0.123943,
  }
);

const GRAND_CENTRAL = new Coordinates(
  {
    latitude: 40.752734,
    longitude: -73.977229,
  }
);

const MANCHESTER_PICCADILLY = new Coordinates(
  {
    latitude: 53.477383,
    longitude: -2.230895,
  }
);

const LONDON_WATERLOO = new Coordinates(
  {
    latitude: 51.502449,
    longitude: -0.113435,
  }
);

describe('geography.mjs', () => {
  describe('distance', () => {
    it('measures King\'s Cross to Grand Central Station', () => {
      expect(distance(KINGS_CROSS, GRAND_CENTRAL)).to.be.closeTo(5550, 50);
    });
    it('measures King\'s Cross to Manchester Piccadilly', () => {
      expect(distance(KINGS_CROSS, MANCHESTER_PICCADILLY)).to.be.closeTo(250, 20);
    });
    it('measures King\'s Cross to London Waterloo', () => {
      expect(distance(KINGS_CROSS, LONDON_WATERLOO)).to.be.closeTo(3.5, 1)
    });
  });
});
