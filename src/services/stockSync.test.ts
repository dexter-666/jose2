import { describe, expect, it } from 'vitest';
import { normalizeRemoteMeta } from './firebaseSync';
import { createInitialStockState, sanitizeStockState } from './stockSync';

describe('stockSync sanitization for Firebase / remote storage', () => {
  it('handles Firebase omitting empty warehouses and converting arrays to numeric maps', () => {
    const initial = createInitialStockState();
    const firebaseLikePayload = {
      version: 1,
      catalog: {
        '0': initial.catalog[0],
        '1': initial.catalog[5],
      },
      warehouses: {
        PT_08: { '0': initial.catalog[0].id },
        // PT_09, PT_15_BAHIA, PT_15_CURVA omitted by Firebase when empty
      },
      lastUpdatedAt: initial.lastUpdatedAt,
      revision: 3,
    };

    const clean = sanitizeStockState(firebaseLikePayload);
    expect(clean).not.toBeNull();
    expect(clean!.warehouses.PT_08).toEqual([initial.catalog[0].id]);
    expect(clean!.warehouses.PT_09).toEqual([]);
    expect(clean!.warehouses.PT_15_BAHIA).toEqual([]);
    expect(clean!.warehouses.PT_15_CURVA).toEqual([]);
    expect(clean!.lastVerifiedAt).toBeNull();
  });

  it('handles Firebase omitting the entire warehouses object when all warehouses are cleared', () => {
    const initial = createInitialStockState();
    const clean = sanitizeStockState({
      version: 1,
      catalog: initial.catalog,
      lastUpdatedAt: initial.lastUpdatedAt,
      revision: 4,
    });
    expect(clean).not.toBeNull();
    expect(clean!.warehouses.PT_08).toEqual([]);
    expect(clean!.warehouses.PT_09).toEqual([]);
    expect(clean!.warehouses.PT_15_BAHIA).toEqual([]);
    expect(clean!.warehouses.PT_15_CURVA).toEqual([]);
  });

  it('normalizes Firebase meta when empty arrays were stripped to undefined', () => {
    const normalized = normalizeRemoteMeta(
      {
        sourceTabId: 'other-browser',
        action: 'verify',
        affectedWarehouses: { '0': 'PT_08' },
        // affectedMeasureIds omitted by Firebase because it was []
      },
      '2026-11-11T11:00:00.000Z'
    );

    expect(normalized).not.toBeNull();
    expect(normalized!.affectedWarehouses).toEqual(['PT_08']);
    expect(normalized!.affectedMeasureIds).toEqual([]);
  });
});

