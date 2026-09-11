import type { Searcher } from '../interfaces/Searcher';
import { SearchCache } from './SearchCache';

// Decorates a Searcher with an IndexedDB-backed cache. `service` has no
// default — the concrete transport (fetch on web, IPC to the Electron main
// process on desktop) is platform-specific and lives in each app, not here.
export class CachedSearchService implements Searcher {
  constructor(
    private readonly service: Searcher,
    private readonly cache: SearchCache = new SearchCache(),
  ) {}

  async search<T>(query: string): Promise<T[]> {
    const cached = await this.cache.get<T>(query);

    if (cached) {
      return cached;
    }

    const result = await this.service.search<T>(query);
    await this.cache.set(query, result);

    return result;
  }
}
