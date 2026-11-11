import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  MeasureItem,
  ShiftCode,
  StockChangeMetadata,
  StockState,
  WarehouseId,
  WarehouseStockMap,
} from '../types/stock';
import {
  buildMeasureItem,
  sortCatalogMeasures,
  sortMeasureIdsByCatalog,
  WAREHOUSES,
} from '../utils/measures';
import {
  createBrowserSyncTransport,
  createInitialStockState,
  loadPersistedStockState,
  SyncEnvelope,
  TAB_ID,
} from '../services/stockSync';

export interface RecentPulseState {
  pulseKey: number;
  action: StockChangeMetadata['action'];
  affectedWarehouses: WarehouseId[];
  affectedMeasureIds: string[];
  timestamp: string;
}

interface StockContextValue {
  state: StockState;
  catalogMap: Map<string, MeasureItem>;
  recentPulse: RecentPulseState | null;
  syncMode: 'local-browser';
  addMeasureToWarehouse: (warehouseId: WarehouseId, measureId: string) => void;
  replaceMeasureInWarehouse: (
    warehouseId: WarehouseId,
    oldMeasureId: string,
    newMeasureId: string
  ) => void;
  removeMeasureFromWarehouse: (warehouseId: WarehouseId, measureId: string) => void;
  clearWarehouse: (warehouseId: WarehouseId) => void;
  addCustomCatalogMeasure: (
    label: string,
    options?: { overrideDiameterMm?: number; overrideLengthM?: number; autoAssignTo?: WarehouseId }
  ) => { ok: boolean; error?: string; measure?: MeasureItem };
  setShift: (shift: ShiftCode) => void;
  verifyStock: () => void;
  confirmStockChanges: (payload: {
    catalog: MeasureItem[];
    warehouses: WarehouseStockMap;
    shift: ShiftCode;
  }) => string;
  resetDemoStock: () => void;
  dismissPulse: () => void;
}

const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StockState>(() => loadPersistedStockState());
  const [recentPulse, setRecentPulse] = useState<RecentPulseState | null>(null);
  const transportRef = useRef(createBrowserSyncTransport());
  const pulseTimeoutRef = useRef<number | null>(null);

  const triggerPulse = useCallback((meta: StockChangeMetadata) => {
    if (pulseTimeoutRef.current !== null) {
      window.clearTimeout(pulseTimeoutRef.current);
    }
    setRecentPulse({
      pulseKey: Date.now(),
      action: meta.action,
      affectedWarehouses: meta.affectedWarehouses,
      affectedMeasureIds: meta.affectedMeasureIds,
      timestamp: meta.timestamp,
    });
    pulseTimeoutRef.current = window.setTimeout(() => {
      setRecentPulse(null);
    }, 3200);
  }, []);

  useEffect(() => {
    const transport = transportRef.current;
    const unsubscribe = transport.subscribe((envelope: SyncEnvelope) => {
      setState(envelope.state);
      triggerPulse(envelope.meta);
    });

    // Reconcile on tab focus in case browser throttled background timers/events
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const persisted = loadPersistedStockState();
        setState((prev) => (persisted.revision > prev.revision ? persisted : prev));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (pulseTimeoutRef.current !== null) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [triggerPulse]);

  const commitState = useCallback(
    (
      updater: (prev: StockState) => StockState,
      metaInput: Omit<StockChangeMetadata, 'sourceTabId' | 'timestamp'>
    ) => {
      setState((prev) => {
        const now = new Date().toISOString();
        const nextBase = updater(prev);
        const nextState: StockState = {
          ...nextBase,
          lastUpdatedAt: now,
          revision: prev.revision + 1,
        };
        const meta: StockChangeMetadata = {
          ...metaInput,
          sourceTabId: TAB_ID,
          timestamp: now,
        };
        transportRef.current.publish({ state: nextState, meta });
        return nextState;
      });
    },
    []
  );

  const catalogMap = useMemo(
    () => new Map<string, MeasureItem>(state.catalog.map((m) => [m.id, m])),
    [state.catalog]
  );

  const addMeasureToWarehouse = useCallback(
    (warehouseId: WarehouseId, measureId: string) => {
      commitState(
        (prev) => {
          const map = new Map<string, MeasureItem>(prev.catalog.map((m) => [m.id, m]));
          if (!map.has(measureId)) return prev;
          const nextIds = sortMeasureIdsByCatalog(
            [...prev.warehouses[warehouseId], measureId],
            map
          );
          return {
            ...prev,
            warehouses: {
              ...prev.warehouses,
              [warehouseId]: nextIds,
            },
          };
        },
        {
          action: 'update',
          affectedWarehouses: [warehouseId],
          affectedMeasureIds: [measureId],
        }
      );
    },
    [commitState]
  );

  const replaceMeasureInWarehouse = useCallback(
    (warehouseId: WarehouseId, oldMeasureId: string, newMeasureId: string) => {
      if (oldMeasureId === newMeasureId) return;
      commitState(
        (prev) => {
          const map = new Map<string, MeasureItem>(prev.catalog.map((m) => [m.id, m]));
          if (!map.has(newMeasureId)) return prev;
          const filtered = prev.warehouses[warehouseId].filter((id) => id !== oldMeasureId);
          const nextIds = sortMeasureIdsByCatalog([...filtered, newMeasureId], map);
          return {
            ...prev,
            warehouses: {
              ...prev.warehouses,
              [warehouseId]: nextIds,
            },
          };
        },
        {
          action: 'update',
          affectedWarehouses: [warehouseId],
          affectedMeasureIds: [newMeasureId],
        }
      );
    },
    [commitState]
  );

  const removeMeasureFromWarehouse = useCallback(
    (warehouseId: WarehouseId, measureId: string) => {
      commitState(
        (prev) => ({
          ...prev,
          warehouses: {
            ...prev.warehouses,
            [warehouseId]: prev.warehouses[warehouseId].filter((id) => id !== measureId),
          },
        }),
        {
          action: 'update',
          affectedWarehouses: [warehouseId],
          affectedMeasureIds: [measureId],
        }
      );
    },
    [commitState]
  );

  const clearWarehouse = useCallback(
    (warehouseId: WarehouseId) => {
      commitState(
        (prev) => ({
          ...prev,
          warehouses: {
            ...prev.warehouses,
            [warehouseId]: [],
          },
        }),
        {
          action: 'update',
          affectedWarehouses: [warehouseId],
          affectedMeasureIds: [],
        }
      );
    },
    [commitState]
  );

  const addCustomCatalogMeasure = useCallback(
    (
      label: string,
      options?: { overrideDiameterMm?: number; overrideLengthM?: number; autoAssignTo?: WarehouseId }
    ): { ok: boolean; error?: string; measure?: MeasureItem } => {
      const trimmed = label.trim().replace(/\s+/g, ' ');
      if (!trimmed) {
        return { ok: false, error: 'Ingresa el nombre de la medida (ej: 1 3/8" x 12 m o 16 mm).' };
      }

      const newMeasure = buildMeasureItem(trimmed, {
        isCustom: true,
        overrideDiameterMm: options?.overrideDiameterMm,
        overrideLengthM: options?.overrideLengthM,
      });

      const duplicate = state.catalog.find(
        (m) =>
          m.id === newMeasure.id || m.label.toLowerCase() === newMeasure.label.toLowerCase()
      );
      if (duplicate) {
        return {
          ok: false,
          error: `La medida "${duplicate.label}" ya existe en el catálogo.`,
        };
      }

      commitState(
        (prev) => {
          const nextCatalog = sortCatalogMeasures([...prev.catalog, newMeasure]);
          const map = new Map<string, MeasureItem>(nextCatalog.map((m) => [m.id, m]));
          const nextWarehouses = { ...prev.warehouses };
          if (options?.autoAssignTo) {
            nextWarehouses[options.autoAssignTo] = sortMeasureIdsByCatalog(
              [...nextWarehouses[options.autoAssignTo], newMeasure.id],
              map
            );
          }
          return {
            ...prev,
            catalog: nextCatalog,
            warehouses: nextWarehouses,
          };
        },
        {
          action: 'catalog_add',
          affectedWarehouses: options?.autoAssignTo ? [options.autoAssignTo] : [],
          affectedMeasureIds: [newMeasure.id],
        }
      );

      return { ok: true, measure: newMeasure };
    },
    [commitState, state.catalog]
  );

  const setShift = useCallback(
    (shift: ShiftCode) => {
      commitState(
        (prev) => ({
          ...prev,
          shift,
        }),
        {
          action: 'update',
          affectedWarehouses: [],
          affectedMeasureIds: [],
        }
      );
    },
    [commitState]
  );

  const verifyStock = useCallback(() => {
    const allWh = WAREHOUSES.map((w) => w.id);
    commitState(
      (prev) => ({
        ...prev,
        lastVerifiedAt: new Date().toISOString(),
      }),
      {
        action: 'verify',
        affectedWarehouses: allWh,
        affectedMeasureIds: [],
      }
    );
  }, [commitState]);

  const confirmStockChanges = useCallback(
    (payload: {
      catalog: MeasureItem[];
      warehouses: WarehouseStockMap;
      shift: ShiftCode;
    }): string => {
      const confirmedAt = new Date().toISOString();
      const sortedCatalog = sortCatalogMeasures(payload.catalog);
      const map = new Map<string, MeasureItem>(sortedCatalog.map((m) => [m.id, m]));
      const normalizedWarehouses = {} as WarehouseStockMap;

      for (const wh of WAREHOUSES) {
        normalizedWarehouses[wh.id] = sortMeasureIdsByCatalog(payload.warehouses[wh.id], map);
      }

      setState((prev) => {
        const changedWarehouses: WarehouseId[] = [];
        const changedMeasureIds = new Set<string>();

        for (const wh of WAREHOUSES) {
          const prevList = prev.warehouses[wh.id];
          const nextList = normalizedWarehouses[wh.id];
          const isDifferent =
            prevList.length !== nextList.length ||
            prevList.some((id, idx) => nextList[idx] !== id);
          if (isDifferent) {
            changedWarehouses.push(wh.id);
            nextList.forEach((id) => {
              if (!prevList.includes(id)) changedMeasureIds.add(id);
            });
          }
        }

        const nextState: StockState = {
          ...prev,
          catalog: sortedCatalog,
          warehouses: normalizedWarehouses,
          shift: payload.shift,
          lastUpdatedAt: confirmedAt,
          lastVerifiedAt: confirmedAt,
          revision: prev.revision + 1,
        };

        const affectedWarehouses =
          changedWarehouses.length > 0 ? changedWarehouses : WAREHOUSES.map((w) => w.id);

        transportRef.current.publish({
          state: nextState,
          meta: {
            sourceTabId: TAB_ID,
            action: 'verify',
            affectedWarehouses,
            affectedMeasureIds: Array.from(changedMeasureIds),
            timestamp: confirmedAt,
          },
        });

        return nextState;
      });

      return confirmedAt;
    },
    []
  );

  const resetDemoStock = useCallback(() => {
    const allWh = WAREHOUSES.map((w) => w.id);
    commitState(
      (prev) => {
        const initial = createInitialStockState();
        return {
          ...initial,
          revision: prev.revision,
        };
      },
      {
        action: 'reset',
        affectedWarehouses: allWh,
        affectedMeasureIds: [],
      }
    );
  }, [commitState]);

  const dismissPulse = useCallback(() => {
    setRecentPulse(null);
  }, []);

  const value = useMemo<StockContextValue>(
    () => ({
      state,
      catalogMap,
      recentPulse,
      syncMode: 'local-browser',
      addMeasureToWarehouse,
      replaceMeasureInWarehouse,
      removeMeasureFromWarehouse,
      clearWarehouse,
      addCustomCatalogMeasure,
      setShift,
      verifyStock,
      confirmStockChanges,
      resetDemoStock,
      dismissPulse,
    }),
    [
      state,
      catalogMap,
      recentPulse,
      addMeasureToWarehouse,
      replaceMeasureInWarehouse,
      removeMeasureFromWarehouse,
      clearWarehouse,
      addCustomCatalogMeasure,
      setShift,
      verifyStock,
      confirmStockChanges,
      resetDemoStock,
      dismissPulse,
    ]
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock(): StockContextValue {
  const ctx = useContext(StockContext);
  if (!ctx) {
    throw new Error('useStock debe usarse dentro de un StockProvider');
  }
  return ctx;
}

