export interface SearchOptions {
  // When true, only ever return cached results — never call the real
  // service. Used to restore state on startup without violating "no
  // requests to the third-party service on restore."
  cacheOnly?: boolean;
  // Aborting this signals that a newer search has superseded this one —
  // implementations should cancel the underlying request where possible.
  signal?: AbortSignal;
}

export interface Searcher {
  search<T>(query: string, options?: SearchOptions): Promise<T[]>;
}
