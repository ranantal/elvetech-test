import type { Searcher } from '../interfaces/Searcher';

// Goes through the dev-server proxy (see apps/*/vite.config.mts), which
// forwards to https://service.test.elvetech.io — avoids CORS in dev.
const API_BASE_URL = '/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

if (!API_TOKEN) {
  throw new Error(
    'VITE_API_TOKEN is not set — copy .env.example to .env and fill it in.',
  );
}

type SearchResponse<T> = {
  items: T[];
};

export class SearchService implements Searcher {
  async search<T>(query: string): Promise<T[]> {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
      { headers: { 'x-api-token': API_TOKEN } },
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
