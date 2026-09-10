// Goes through the dev-server proxy (see apps/*/vite.config.mts), which
// forwards to https://service.test.elvetech.io — avoids CORS in dev.
const API_BASE_URL = '/api';
const API_TOKEN = 'e50fd2bc-5328-427d-97a6-4d598593159a';

type SearchResponse<T> = {
  items: T[];
};

export class SearchService {
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
