export interface Searcher {
  search<T>(query: string): Promise<T[]>;
}
