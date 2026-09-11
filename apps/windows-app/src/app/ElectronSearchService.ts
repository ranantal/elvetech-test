import type { Searcher } from '@elvetech/data-access';
import './electronApi';

// Runs the actual request in the main process (Node, not a browser context)
// via the preload bridge's 'search' IPC channel — no CORS to work around,
// and the app doesn't depend on any web deployment being reachable to search.
export class ElectronSearchService implements Searcher {
  async search<T>(query: string): Promise<T[]> {
    if (!window.electronAPI) {
      throw new Error('electronAPI is not available on window');
    }

    return window.electronAPI.search<T>(query);
  }
}
