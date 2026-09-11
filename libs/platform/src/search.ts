// Deliberately not imported from @elvetech/data-access's Searcher — platform
// doesn't depend on data-access, same reasoning as DownloadHandler. Any
// implementation that satisfies this shape structurally can be passed in
// from the app layer.
export interface SearchOptions {
  cacheOnly?: boolean;
  // Aborting this signals that a newer search has superseded this one —
  // implementations should cancel the underlying request where possible.
  signal?: AbortSignal;
}

export interface SearchHandler {
  search<T>(query: string, options?: SearchOptions): Promise<T[]>;
}
