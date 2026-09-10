import type { Searcher } from '../interfaces/Searcher';
import { SearchService } from './SearchService';
import { SearchCache } from './SearchCache';

// Decorates a Searcher with an IndexedDB-backed cache, keeping the fetch
// logic in SearchService itself unaware of caching.
export class CachedSearchService implements Searcher {
  constructor(
    private readonly service: Searcher = new SearchService(),
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
