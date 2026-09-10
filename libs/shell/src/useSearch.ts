import { useCallback, useEffect, useState } from 'react';
import { CachedSearchService, SearchHistory } from '@elvetech/data-access';
import type { ItemPosts, PostData } from '@elvetech/ui';

const searchService = new CachedSearchService();
const searchHistory = new SearchHistory();
const LAST_QUERY_STORAGE_KEY = 'elvetech:last-search-query';

export interface UseSearchResult {
  items: ItemPosts[];
  initialQuery: string;
  history: string[];
  loading: boolean;
  search: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

export function useSearch(): UseSearchResult {
  const [items, setItems] = useState<ItemPosts[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialQuery] = useState(
    () => localStorage.getItem(LAST_QUERY_STORAGE_KEY) ?? '',
  );

  const refreshHistory = useCallback(() => {
    searchHistory.getRecent().then(setHistory);
  }, []);

  const search = useCallback(
    (query: string) => {
      localStorage.setItem(LAST_QUERY_STORAGE_KEY, query);
      searchHistory.add(query).then(refreshHistory);
      setItems([]);
      setLoading(true);

      const requests = [query, `${query} graffiti`].map((text, slot) =>
        searchService.search<PostData>(text).then((posts) => {
          setItems((prev) => mergeSlot(prev, posts, slot as 0 | 1));
        }),
      );

      Promise.allSettled(requests).then(() => setLoading(false));
    },
    [refreshHistory],
  );

  const removeFromHistory = useCallback(
    (query: string) => {
      searchHistory.remove(query).then(refreshHistory);
    },
    [refreshHistory],
  );

  const clearHistory = useCallback(() => {
    searchHistory.clear().then(refreshHistory);
  }, [refreshHistory]);

  // Restore the last search and the persisted history on startup.
  useEffect(() => {
    refreshHistory();

    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, refreshHistory, search]);

  return {
    items,
    initialQuery,
    history,
    loading,
    search,
    removeFromHistory,
    clearHistory,
  };
}

function mergeSlot(
  prev: ItemPosts[],
  posts: PostData[],
  slot: 0 | 1,
): ItemPosts[] {
  const next = [...prev];

  posts.forEach((post, index) => {
    const pair: ItemPosts = next[index]
      ? ([...next[index]] as ItemPosts)
      : [undefined, undefined];
    pair[slot] = post;
    next[index] = pair;
  });

  return next;
}
