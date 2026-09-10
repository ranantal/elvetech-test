import { SearchService } from './SearchService';
import { SearchCache } from './SearchCache';

export class CachedSearchService {
  constructor(
    private readonly service: SearchService = new SearchService(),
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
