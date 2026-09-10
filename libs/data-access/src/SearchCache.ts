import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'elvetech-search-cache';
const STORE_NAME = 'results';
const TTL_MS = 60 * 60 * 1000;

interface CacheEntry<T> {
  result: T[];
  storedAt: number;
}

let dbPromise: Promise<IDBPDatabase> | undefined;

function getDb() {
  dbPromise ??= openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return dbPromise;
}

export class SearchCache {
  async get<T>(query: string): Promise<T[] | undefined> {
    const db = await getDb();
    const entry: CacheEntry<T> | undefined = await db.get(STORE_NAME, query);

    if (!entry || Date.now() - entry.storedAt > TTL_MS) {
      return undefined;
    }

    return entry.result;
  }

  async set<T>(query: string, result: T[]): Promise<void> {
    const db = await getDb();
    const entry: CacheEntry<T> = { result, storedAt: Date.now() };
    await db.put(STORE_NAME, entry, query);
  }
}
