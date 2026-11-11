import {
  MeasureItem,
  StockChangeMetadata,
  StockState,
  WarehouseId,
  WarehouseStockMap,
} from '../types/stock';
import {
  INITIAL_CATALOG,
  INITIAL_WAREHOUSE_STOCK,
  sortCatalogMeasures,
  sortMeasureIdsByCatalog,
  WAREHOUSES,
} from '../utils/measures';
import { detectCurrentShift } from '../utils/shifts';

export const STORAGE_KEY = 'gerdau_siderperu_stock_v1';
export const CHANNEL_NAME = 'gerdau-siderperu-stock-sync';
export const STATE_VERSION = 1;

export interface SyncEnvelope {
  state: StockState;
  meta: StockChangeMetadata;
}

export type SyncMode = 'cloud-redis' | 'local-browser';

export interface RemoteFetchResult {
  configured: boolean;
  unchanged?: boolean;
  revision?: number;
  state?: StockState | null;
  meta?: StockChangeMetadata | null;
}

export interface RemotePushResult {
  ok: boolean;
  configured: boolean;
  state?: StockState;
  meta?: StockChangeMetadata | null;
}

/**
 * Abstract interface allowing seamless local-browser + remote cloud sync
 * without changing UI components.
 */
export interface StockSyncTransport {
  readonly mode: SyncMode;
  publish: (envelope: SyncEnvelope) => void;
  subscribe: (onSync: (envelope: SyncEnvelope) => void) => () => void;
}

export const TAB_ID: string =
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function createInitialStockState(): StockState {
  const catalog = sortCatalogMeasures(INITIAL_CATALOG);
  const catalogMap = new Map<string, MeasureItem>(catalog.map((m) => [m.id, m]));
  const warehouses: WarehouseStockMap = {
    PT_08: sortMeasureIdsByCatalog(INITIAL_WAREHOUSE_STOCK.PT_08, catalogMap),
    PT_09: sortMeasureIdsByCatalog(INITIAL_WAREHOUSE_STOCK.PT_09, catalogMap),
    PT_15_BAHIA: sortMeasureIdsByCatalog(INITIAL_WAREHOUSE_STOCK.PT_15_BAHIA, catalogMap),
    PT_15_CURVA: sortMeasureIdsByCatalog(INITIAL_WAREHOUSE_STOCK.PT_15_CURVA, catalogMap),
  };

  return {
    version: STATE_VERSION,
    catalog,
    warehouses,
    shift: detectCurrentShift(),
    lastUpdatedAt: new Date().toISOString(),
    lastVerifiedAt: null,
    revision: 1,
  };
}

export function sanitizeStockState(raw: unknown): StockState | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<StockState>;
  if (!Array.isArray(candidate.catalog) || !candidate.warehouses) return null;

  const validCatalog = sortCatalogMeasures(
    candidate.catalog.filter(
      (item): item is MeasureItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.label === 'string' &&
        typeof item.diameterMm === 'number' &&
        typeof item.lengthM === 'number'
    )
  );

  if (validCatalog.length === 0) return null;

  const catalogMap = new Map<string, MeasureItem>(validCatalog.map((m) => [m.id, m]));
  const normalizedWarehouses = {} as WarehouseStockMap;

  for (const wh of WAREHOUSES) {
    const rawList = (candidate.warehouses as Record<string, unknown>)[wh.id];
    const idList = Array.isArray(rawList)
      ? rawList.filter((id): id is string => typeof id === 'string')
      : [];
    normalizedWarehouses[wh.id] = sortMeasureIdsByCatalog(idList, catalogMap);
  }

  return {
    version: STATE_VERSION,
    catalog: validCatalog,
    warehouses: normalizedWarehouses,
    shift:
      candidate.shift === '07:00' || candidate.shift === '15:00' || candidate.shift === '23:00'
        ? candidate.shift
        : detectCurrentShift(),
    lastUpdatedAt:
      typeof candidate.lastUpdatedAt === 'string'
        ? candidate.lastUpdatedAt
        : new Date().toISOString(),
    lastVerifiedAt:
      typeof candidate.lastVerifiedAt === 'string' ? candidate.lastVerifiedAt : null,
    revision: typeof candidate.revision === 'number' ? candidate.revision : 1,
  };
}

export function loadPersistedStockState(): StockState {
  if (typeof window === 'undefined') {
    return createInitialStockState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialStockState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = sanitizeStockState(JSON.parse(raw));
    if (parsed) return parsed;
  } catch {
    // Corrupted storage falls back cleanly to initial state
  }
  const fallback = createInitialStockState();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
  return fallback;
}

export function savePersistedStockState(state: StockState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export async function fetchRemoteStockState(
  sinceRevision?: number
): Promise<RemoteFetchResult | null> {
  if (typeof fetch !== 'function') return null;
  try {
    const query =
      typeof sinceRevision === 'number'
        ? `?sinceRevision=${encodeURIComponent(String(sinceRevision))}`
        : '';
    const response = await fetch(`/api/stock${query}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as RemoteFetchResult;
    if (!data || typeof data.configured !== 'boolean') return null;

    if (data.state) {
      const clean = sanitizeStockState(data.state);
      return { ...data, state: clean };
    }
    return data;
  } catch {
    return null;
  }
}

export async function pushRemoteStockState(
  envelope: SyncEnvelope
): Promise<RemotePushResult | null> {
  if (typeof fetch !== 'function') return null;
  try {
    const response = await fetch('/api/stock', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(envelope),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as RemotePushResult;
    if (data?.state) {
      const clean = sanitizeStockState(data.state);
      if (clean) return { ...data, state: clean };
    }
    return data;
  } catch {
    return null;
  }
}

export function createBrowserSyncTransport(): StockSyncTransport {
  let channel: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      channel = null;
    }
  }

  let lastHandledRevision = -1;

  return {
    mode: 'local-browser',
    publish(envelope: SyncEnvelope) {
      lastHandledRevision = envelope.state.revision;
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope.state));
        } catch {
          // Ignore storage quota errors
        }
      }
      if (channel) {
        try {
          channel.postMessage(envelope);
        } catch {
          // Channel might be closed
        }
      }
    },
    subscribe(onSync: (envelope: SyncEnvelope) => void) {
      if (typeof window === 'undefined') return () => {};

      const handleBroadcast = (event: MessageEvent<SyncEnvelope>) => {
        const data = event.data;
        if (!data || !data.state || !data.meta) return;
        if (data.meta.sourceTabId === TAB_ID) return;
        if (data.state.revision <= lastHandledRevision) return;

        const cleanState = sanitizeStockState(data.state);
        if (!cleanState) return;

        lastHandledRevision = cleanState.revision;
        onSync({ state: cleanState, meta: data.meta });
      };

      const handleStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY || !event.newValue) return;
        try {
          const cleanState = sanitizeStockState(JSON.parse(event.newValue));
          if (!cleanState) return;
          if (cleanState.revision <= lastHandledRevision) return;

          lastHandledRevision = cleanState.revision;
          const allWarehouses: WarehouseId[] = WAREHOUSES.map((w) => w.id);
          onSync({
            state: cleanState,
            meta: {
              sourceTabId: 'storage-event',
              action: 'update',
              affectedWarehouses: allWarehouses,
              affectedMeasureIds: [],
              timestamp: cleanState.lastUpdatedAt,
            },
          });
        } catch {
          // Ignore invalid JSON
        }
      };

      channel?.addEventListener('message', handleBroadcast);
      window.addEventListener('storage', handleStorage);

      return () => {
        channel?.removeEventListener('message', handleBroadcast);
        window.removeEventListener('storage', handleStorage);
      };
    },
  };
}

