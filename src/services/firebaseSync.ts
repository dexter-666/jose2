import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Database,
  getDatabase,
  onValue,
  ref,
  runTransaction,
  set,
} from 'firebase/database';
import type { StockChangeMetadata, StockState } from '../types/stock';
import {
  createInitialStockState,
  sanitizeStockState,
  STORAGE_KEY,
  SyncEnvelope,
} from './stockSync';

interface FirebaseStockRecord {
  state: StockState;
  meta: StockChangeMetadata | null;
}

function getFirebaseDatabaseUrl(): string {
  return (import.meta.env.VITE_FIREBASE_DATABASE_URL ?? '').trim();
}

export function isFirebaseConfigured(): boolean {
  const url = getFirebaseDatabaseUrl();
  return url.startsWith('https://');
}

function getOrCreateFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  const databaseURL = getFirebaseDatabaseUrl();
  const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY ?? '').trim();
  const authDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '').trim();
  const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '').trim();
  const storageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '').trim();
  const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '').trim();
  const appId = (import.meta.env.VITE_FIREBASE_APP_ID ?? '').trim();

  return initializeApp({
    databaseURL,
    ...(apiKey ? { apiKey } : {}),
    ...(authDomain ? { authDomain } : {}),
    ...(projectId ? { projectId } : {}),
    ...(storageBucket ? { storageBucket } : {}),
    ...(messagingSenderId ? { messagingSenderId } : {}),
    ...(appId ? { appId } : {}),
  });
}

function getStockDb(): Database {
  const app = getOrCreateFirebaseApp();
  return getDatabase(app);
}

function toFirebaseSafeJson<T>(value: T): T {
  // Firebase RTDB rejects undefined properties; JSON roundtrip strips them cleanly
  return JSON.parse(JSON.stringify(value)) as T;
}

export function subscribeFirebaseStockState(
  onUpdate: (record: FirebaseStockRecord) => void,
  onError?: (error: Error) => void
): () => void {
  const db = getStockDb();
  const stockRef = ref(db, STORAGE_KEY);
  let seeded = false;

  const unsubscribe = onValue(
    stockRef,
    (snapshot) => {
      const rawVal = snapshot.val() as Partial<FirebaseStockRecord> | null;
      if (!rawVal || !rawVal.state) {
        if (!seeded) {
          seeded = true;
          const initialRecord = toFirebaseSafeJson<FirebaseStockRecord>({
            state: createInitialStockState(),
            meta: null,
          });
          void runTransaction(stockRef, (current) => current ?? initialRecord).catch((err) => {
            onError?.(err instanceof Error ? err : new Error('Error inicializando Firebase'));
          });
        }
        return;
      }

      const cleanState = sanitizeStockState(rawVal.state);
      if (!cleanState) return;

      onUpdate({
        state: cleanState,
        meta: rawVal.meta ?? null,
      });
    },
    (err) => {
      onError?.(err);
    }
  );

  return unsubscribe;
}

export async function pushFirebaseStockState(envelope: SyncEnvelope): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getStockDb();
  const stockRef = ref(db, STORAGE_KEY);
  const payload = toFirebaseSafeJson<FirebaseStockRecord>({
    state: envelope.state,
    meta: envelope.meta,
  });
  await set(stockRef, payload);
}
