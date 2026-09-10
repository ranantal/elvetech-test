import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'elvetech-search-history';
const STORE_NAME = 'queries';
const RECENT_LIMIT = 5;

interface HistoryEntry {
  query: string;
  searchedAt: number;
}

let dbPromise: Promise<IDBPDatabase> | undefined;

function getDb() {
  dbPromise ??= openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'query' });
    },
  });
  return dbPromise;
}

// Keyed by query text, so re-searching the same string bumps it to the
// front instead of creating a duplicate entry.
export class SearchHistory {
  async add(query: string): Promise<void> {
    const db = await getDb();
    const entry: HistoryEntry = { query, searchedAt: Date.now() };
    await db.put(STORE_NAME, entry);
  }

  async remove(query: string): Promise<void> {
    const db = await getDb();
    await db.delete(STORE_NAME, query);
  }

  async clear(): Promise<void> {
    const db = await getDb();
    await db.clear(STORE_NAME);
  }

  async getRecent(limit = RECENT_LIMIT): Promise<string[]> {
    const db = await getDb();
    const entries: HistoryEntry[] = await db.getAll(STORE_NAME);

    return entries
      .sort((a, b) => b.searchedAt - a.searchedAt)
      .slice(0, limit)
      .map((entry) => entry.query);
  }
}
