import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CachedSearchService,
  type Searcher,
  type SearchHistory,
} from '@elvetech/data-access';
import { useNotifyError, type ItemPosts, type PostData } from '@elvetech/ui';
import { useHistory, defaultSearchHistory } from './useHistory';

const defaultSearchService = new CachedSearchService();

export interface UseSearchResult {
  items: ItemPosts[];
  initialQuery: string;
  history: string[];
  loading: boolean;
  search: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

// searchService/searchHistory are injectable — mirrors CachedSearchService's
// own constructor defaults — so this hook can be tested with fakes instead
// of mocking the module.
export function useSearch(
  searchService: Searcher = defaultSearchService,
  searchHistory: SearchHistory = defaultSearchHistory,
): UseSearchResult {
  const [items, setItems] = useState<ItemPosts[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const { history, addToHistory, removeFromHistory, clearHistory } =
    useHistory(searchHistory);
  const notifyError = useNotifyError();

  const search = useCallback(
    (query: string) => {
      addToHistory(query);
      setItems([]);
      setLoading(true);

      const requests = [query, `${query} graffiti`].map((text, slot) =>
        searchService
          .search<PostData>(text)
          .then((posts) => {
            setItems((prev) => mergeSlot(prev, posts, slot as 0 | 1));
          })
          .catch(() => {
            notifyError('Search request failed');
          }),
      );

      Promise.allSettled(requests).then(() => setLoading(false));
    },
    [searchService, addToHistory, notifyError],
  );

  // Restore the last search on startup, if there is one — the most recent
  // SearchHistory entry doubles as "last query" so there's no separate
  // persistence channel just for that. This must only ever run once: history
  // itself changes on every subsequent search, so a naive effect keyed on it
  // would re-trigger a restore search after every manual one.
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) {
      return;
    }
    restoredRef.current = true;

    searchHistory.getRecent(1).then(([lastQuery]) => {
      if (lastQuery) {
        setInitialQuery(lastQuery);
        search(lastQuery);
      }
    });
  }, [search, searchHistory]);

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
