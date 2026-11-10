import { describe, expect, it } from 'vitest';
import {
  buildMeasureItem,
  INITIAL_CATALOG,
  matchesMeasureQuery,
  sortCatalogMeasures,
} from './measures';

describe('measures domain logic', () => {
  it('preserves exact thin-to-thick order for the 13 initial catalog measures', () => {
    expect(INITIAL_CATALOG.map((m) => m.label)).toEqual([
      '6 mm',
      '8 mm',
      '3/8" x 9 m',
      '3/8" x 12 m',
      '12 mm',
      '1/2" x 9 m',
      '1/2" x 12 m',
      '5/8" x 9 m',
      '5/8" x 12 m',
      '3/4" x 9 m',
      '3/4" x 12 m',
      '1" x 9 m',
      '1" x 12 m',
    ]);
  });

  it('automatically sorts custom measures thin-to-thick by diameter then length', () => {
    const withCustom = sortCatalogMeasures([
      ...INITIAL_CATALOG,
      buildMeasureItem('1 3/8" x 12 m', { isCustom: true }),
      buildMeasureItem('10 mm', { isCustom: true }),
      buildMeasureItem('3/4" x 6 m', { isCustom: true }),
    ]);

    const labels = withCustom.map((m) => m.label);
    expect(labels.indexOf('10 mm')).toBeGreaterThan(labels.indexOf('3/8" x 12 m'));
    expect(labels.indexOf('10 mm')).toBeLessThan(labels.indexOf('12 mm'));

    expect(labels.indexOf('3/4" x 6 m')).toBeGreaterThan(labels.indexOf('5/8" x 12 m'));
    expect(labels.indexOf('3/4" x 6 m')).toBeLessThan(labels.indexOf('3/4" x 9 m'));

    expect(labels.indexOf('1 3/8" x 12 m')).toBe(labels.length - 1);
  });

  it('matches SAP picking queries flexibly without false positives', () => {
    expect(matchesMeasureQuery('1/2" x 9 m', '1/2 x 9')).toBe(true);
    expect(matchesMeasureQuery('1/2" x 12 m', '1/2 x 9')).toBe(false);
    expect(matchesMeasureQuery('1/2" x 9 m', '1/2x9')).toBe(true);
    expect(matchesMeasureQuery('3/8" x 12 m', '3/8 12')).toBe(true);
    expect(matchesMeasureQuery('12 mm', '12mm')).toBe(true);
    expect(matchesMeasureQuery('1/2" x 12 m', '12mm')).toBe(false);
  });
});

