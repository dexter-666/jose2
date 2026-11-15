import { describe, expect, it } from 'vitest';
import {
  buildMeasureItem,
  CLASSIFICATION_GROUPS,
  INITIAL_CATALOG,
  matchesMeasureQuery,
  sortCatalogMeasures,
} from './measures';

describe('measures domain logic', () => {
  it('covers all 8 classification groups with full technical descriptions', () => {
    const presentGroups = new Set(INITIAL_CATALOG.map((m) => m.group));
    for (const g of CLASSIFICATION_GROUPS) {
      expect(presentGroups.has(g)).toBe(true);
    }

    // Must include exact technical format required by spec
    const mediaItem = INITIAL_CATALOG.find((m) => m.technicalDescription === 'Media x 9 y A 6 15');
    expect(mediaItem).toBeDefined();
    expect(mediaItem!.group).toBe('Nacional');
    expect(mediaItem!.diameterMm).toBe(12.7);

    // All items must have non-empty technicalDescription and label
    for (const item of INITIAL_CATALOG) {
      expect(item.technicalDescription.trim().length).toBeGreaterThan(0);
      expect(item.label.trim().length).toBeGreaterThan(0);
      expect(item.diameterMm).toBeGreaterThan(0);
    }
  });

  it('preserves strict thin-to-thick ordering across the catalog', () => {
    for (let i = 0; i < INITIAL_CATALOG.length - 1; i++) {
      const a = INITIAL_CATALOG[i];
      const b = INITIAL_CATALOG[i + 1];
      if (Math.abs(a.diameterMm - b.diameterMm) > 1e-4) {
        expect(a.diameterMm).toBeLessThanOrEqual(b.diameterMm);
      } else if (Math.abs(a.lengthM - b.lengthM) > 1e-4) {
        expect(a.lengthM).toBeLessThanOrEqual(b.lengthM);
      }
    }
  });

  it('automatically sorts custom measures thin-to-thick by diameter then length', () => {
    const withCustom = sortCatalogMeasures([
      ...INITIAL_CATALOG,
      buildMeasureItem('10 mm', { isCustom: true }),
      buildMeasureItem('3/4" x 6 m', { isCustom: true }),
      buildMeasureItem('3" x 12 m', { isCustom: true, overrideDiameterMm: 76.2 }),
    ]);

    const labels = withCustom.map((m) => m.label);
    expect(labels.indexOf('10 mm')).toBeGreaterThan(labels.indexOf('3/8" x 12 m'));
    expect(labels.indexOf('10 mm')).toBeLessThan(labels.indexOf('12 mm'));

    expect(labels.indexOf('3/4" x 6 m')).toBeGreaterThan(labels.indexOf('5/8" x 12 m'));
    expect(labels.indexOf('3/4" x 6 m')).toBeLessThan(labels.indexOf('3/4" x 9 m'));

    expect(labels.indexOf('3" x 12 m')).toBe(labels.length - 1);
  });

  it('matches picking queries flexibly across labels, technical descriptions, and groups', () => {
    expect(matchesMeasureQuery('1/2" x 9 m', '1/2 x 9')).toBe(true);
    expect(matchesMeasureQuery('1/2" x 12 m', '1/2 x 9')).toBe(false);
    expect(matchesMeasureQuery('1/2" x 9 m', '1/2x9')).toBe(true);
    expect(matchesMeasureQuery('3/8" x 12 m', '3/8 12')).toBe(true);
    expect(matchesMeasureQuery('12 mm', '12mm')).toBe(true);
    expect(matchesMeasureQuery('1/2" x 12 m', '12mm')).toBe(false);

    // Matching by technical description
    const mediaItem = INITIAL_CATALOG.find((m) => m.technicalDescription === 'Media x 9 y A 6 15')!;
    expect(matchesMeasureQuery(mediaItem, 'Media')).toBe(true);
    expect(matchesMeasureQuery(mediaItem, 'A 6 15')).toBe(true);
    expect(matchesMeasureQuery(mediaItem, 'Nacional')).toBe(true);
  });
});
