// Deliberately not imported from @elvetech/data-access's Searcher — platform
// doesn't depend on data-access, same reasoning as DownloadHandler. Any
// implementation that satisfies this shape structurally can be passed in
// from the app layer.
export interface SearchHandler {
  search<T>(query: string): Promise<T[]>;
}
