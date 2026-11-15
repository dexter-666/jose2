import { Redis } from '@upstash/redis';

export const STORAGE_KEY = 'gerdau_siderperu_stock_v1';

export interface StockChangeMetadata {
  sourceTabId: string;
  action: 'verify' | 'reset' | 'catalog_add' | 'update';
  affectedWarehouses: string[];
  affectedMeasureIds: string[];
  timestamp: string;
}

export interface StockState {
  version: number;
  catalog: unknown[];
  warehouses: Record<string, string[]>;
  shift: string;
  lastUpdatedAt: string;
  lastVerifiedAt: string | null;
  revision: number;
}

interface StoredStockRecord {
  state: StockState;
  meta: StockChangeMetadata | null;
}

const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

function getEnv(name: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.[name];
}

function getRedisClient(): Redis | null {
  const url = getEnv('UPSTASH_REDIS_REST_URL') || getEnv('KV_REST_API_URL');
  const token = getEnv('UPSTASH_REDIS_REST_TOKEN') || getEnv('KV_REST_API_TOKEN');
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  });
}

function sanitizeMeta(raw: unknown, fallbackTimestamp: string): StockChangeMetadata | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<StockChangeMetadata>;
  return {
    sourceTabId: typeof candidate.sourceTabId === 'string' ? candidate.sourceTabId : 'remote',
    action:
      candidate.action === 'verify' ||
      candidate.action === 'reset' ||
      candidate.action === 'catalog_add' ||
      candidate.action === 'update'
        ? candidate.action
        : 'update',
    affectedWarehouses: Array.isArray(candidate.affectedWarehouses)
      ? candidate.affectedWarehouses.filter((x): x is string => typeof x === 'string')
      : [],
    affectedMeasureIds: Array.isArray(candidate.affectedMeasureIds)
      ? candidate.affectedMeasureIds.filter((x): x is string => typeof x === 'string')
      : [],
    timestamp:
      typeof candidate.timestamp === 'string' ? candidate.timestamp : fallbackTimestamp,
  };
}

function sanitizeStockState(raw: unknown): StockState | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<StockState>;
  if (!Array.isArray(candidate.catalog) || !candidate.warehouses || typeof candidate.warehouses !== 'object') {
    return null;
  }
  return {
    version: typeof candidate.version === 'number' ? candidate.version : 1,
    catalog: candidate.catalog,
    warehouses: candidate.warehouses as Record<string, string[]>,
    shift: typeof candidate.shift === 'string' ? candidate.shift : 'Turno 1',
    lastUpdatedAt: typeof candidate.lastUpdatedAt === 'string' ? candidate.lastUpdatedAt : new Date().toISOString(),
    lastVerifiedAt: typeof candidate.lastVerifiedAt === 'string' ? candidate.lastVerifiedAt : null,
    revision: typeof candidate.revision === 'number' ? candidate.revision : 1,
  };
}

export async function GET(request: Request): Promise<Response> {
  const redis = getRedisClient();
  if (!redis) {
    return jsonResponse({ configured: false, unchanged: false, state: null, meta: null });
  }

  try {
    const url = new URL(request.url);
    const sinceParam = url.searchParams.get('sinceRevision');
    const sinceRevision = sinceParam !== null ? Number.parseInt(sinceParam, 10) : NaN;

    const record = await redis.get<StoredStockRecord>(STORAGE_KEY);
    const cleanState = record ? sanitizeStockState(record.state) : null;

    if (!cleanState) {
      return jsonResponse({
        configured: true,
        unchanged: false,
        state: null,
        meta: null,
      });
    }

    if (!Number.isNaN(sinceRevision) && cleanState.revision <= sinceRevision) {
      return jsonResponse({
        configured: true,
        unchanged: true,
        revision: cleanState.revision,
      });
    }

    return jsonResponse({
      configured: true,
      unchanged: false,
      state: cleanState,
      meta: record?.meta ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al leer Redis';
    return jsonResponse({ configured: true, error: message }, 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  const redis = getRedisClient();
  if (!redis) {
    return jsonResponse({ ok: false, configured: false });
  }

  try {
    const body = (await request.json()) as { state?: unknown; meta?: unknown };
    const cleanIncoming = sanitizeStockState(body?.state);
    if (!cleanIncoming) {
      return jsonResponse({ ok: false, error: 'Formato de estado inválido' }, 400);
    }

    const existing = await redis.get<StoredStockRecord>(STORAGE_KEY);
    const existingState = existing ? sanitizeStockState(existing.state) : null;
    const nextRevision = Math.max(cleanIncoming.revision, (existingState?.revision ?? 0) + 1);

    const nextState: StockState = {
      ...cleanIncoming,
      revision: nextRevision,
    };
    const nextMeta = sanitizeMeta(body?.meta, nextState.lastUpdatedAt);
    const nextRecord: StoredStockRecord = {
      state: nextState,
      meta: nextMeta,
    };

    await redis.set(STORAGE_KEY, nextRecord);

    return jsonResponse({
      ok: true,
      configured: true,
      state: nextState,
      meta: nextMeta,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al guardar en Redis';
    return jsonResponse({ ok: false, configured: true, error: message }, 500);
  }
}
