import { IndexedDbStore } from './IndexedDbStore';

const TTL_MS = 60 * 60 * 1000;

interface CacheEntry<T> {
  result: T[];
  storedAt: number;
}

const store = new IndexedDbStore<CacheEntry<unknown>>(
  'elvetech-search-cache',
  'results',
);

export class SearchCache {
  async get<T>(query: string): Promise<T[] | undefined> {
    const entry = (await store.get(query)) as CacheEntry<T> | undefined;

    if (!entry || Date.now() - entry.storedAt > TTL_MS) {
      return undefined;
    }

    return entry.result;
  }

  async set<T>(query: string, result: T[]): Promise<void> {
    const entry: CacheEntry<T> = { result, storedAt: Date.now() };
    await store.put(entry, query);
  }
}
