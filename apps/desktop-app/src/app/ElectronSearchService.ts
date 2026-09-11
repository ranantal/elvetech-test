import type { Searcher, SearchOptions } from '@elvetech/data-access';
import './electronApi';

// Runs the actual request in the main process (Node, not a browser context)
// via the preload bridge's 'search' IPC channel — no CORS to work around,
// and the app doesn't depend on any web deployment being reachable to search.
export class ElectronSearchService implements Searcher {
  async search<T>(query: string, options?: SearchOptions): Promise<T[]> {
    if (!window.electronAPI) {
      throw new Error('electronAPI is not available on window');
    }

    const { electronAPI } = window;
    const requestId = crypto.randomUUID();

    // ipcRenderer.invoke has no built-in cancellation, so an abort is
    // forwarded as its own fire-and-forget IPC message telling the main
    // process to abort the fetch it's holding open for this request.
    const onAbort = () => electronAPI.cancelSearch(requestId);
    options?.signal?.addEventListener('abort', onAbort);

    try {
      return await electronAPI.search<T>(query, requestId);
    } finally {
      options?.signal?.removeEventListener('abort', onAbort);
    }
  }
}
