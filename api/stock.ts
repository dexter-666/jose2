import { Redis } from '@upstash/redis';
import {
  createInitialStockState,
  sanitizeStockState,
  STORAGE_KEY,
} from '../src/services/stockSync';
import type { StockChangeMetadata, StockState } from '../src/types/stock';

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
      ? candidate.affectedWarehouses
      : [],
    affectedMeasureIds: Array.isArray(candidate.affectedMeasureIds)
      ? candidate.affectedMeasureIds
      : [],
    timestamp:
      typeof candidate.timestamp === 'string' ? candidate.timestamp : fallbackTimestamp,
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

    let record = await redis.get<StoredStockRecord>(STORAGE_KEY);
    let cleanState = record ? sanitizeStockState(record.state) : null;

    if (!cleanState) {
      cleanState = createInitialStockState();
      const initialRecord: StoredStockRecord = { state: cleanState, meta: null };
      await redis.set(STORAGE_KEY, initialRecord, { nx: true });
      const storedAfterNx = await redis.get<StoredStockRecord>(STORAGE_KEY);
      if (storedAfterNx) {
        const sanitizedAfter = sanitizeStockState(storedAfterNx.state);
        if (sanitizedAfter) {
          cleanState = sanitizedAfter;
          record = storedAfterNx;
        }
      }
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
