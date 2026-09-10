import type { Searcher } from '../interfaces/Searcher';

// Goes through the dev-server proxy (see apps/*/vite.config.mts), which
// forwards to https://service.test.elvetech.io and injects the API token
// server-side — the client never sees it, so it's not in this bundle at all.
const API_BASE_URL = '/api';

type SearchResponse<T> = {
  items: T[];
};

export class SearchService implements Searcher {
  async search<T>(query: string): Promise<T[]> {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(
        `Search request failed: ${response.status} ${response.statusText}`,
      );
    }

    const json: SearchResponse<T> = await response.json();

    return json.items;
  }
}
