import { IndexedDbStore } from './IndexedDbStore';

const RECENT_LIMIT = 5;

interface HistoryEntry {
  query: string;
  searchedAt: number;
}

const store = new IndexedDbStore<HistoryEntry>(
  'elvetech-search-history',
  'queries',
  { keyPath: 'query' },
);

// Keyed by query text, so re-searching the same string bumps it to the
// front instead of creating a duplicate entry.
export class SearchHistory {
  async add(query: string): Promise<void> {
    const entry: HistoryEntry = { query, searchedAt: Date.now() };
    await store.put(entry);
  }

  async remove(query: string): Promise<void> {
    await store.delete(query);
  }

  async clear(): Promise<void> {
    await store.clear();
  }

  async getRecent(limit = RECENT_LIMIT): Promise<string[]> {
    const entries = await store.getAll();

    return entries
      .sort((a, b) => b.searchedAt - a.searchedAt)
      .slice(0, limit)
      .map((entry) => entry.query);
  }
}
