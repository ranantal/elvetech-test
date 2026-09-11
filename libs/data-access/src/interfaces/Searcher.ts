export interface SearchOptions {
  cacheOnly?: boolean;
}

export interface Searcher {
  search<T>(query: string, options?: SearchOptions): Promise<T[]>;
}
