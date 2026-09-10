import { useCallback, useEffect, useState } from 'react';
import { CachedSearchService } from '@elvetech/data-access';
import type { ItemPosts, PostData } from '@elvetech/ui';

const searchService = new CachedSearchService();
const LAST_QUERY_STORAGE_KEY = 'elvetech:last-search-query';

export interface UseSearchResult {
  items: ItemPosts[];
  initialQuery: string;
  search: (query: string) => void;
}

export function useSearch(): UseSearchResult {
  const [items, setItems] = useState<ItemPosts[]>([]);
  const [initialQuery] = useState(
    () => localStorage.getItem(LAST_QUERY_STORAGE_KEY) ?? '',
  );

  const search = useCallback((query: string) => {
    localStorage.setItem(LAST_QUERY_STORAGE_KEY, query);
    setItems([]);

    [query, `${query} graffiti`].forEach((text, slot) => {
      searchService.search<PostData>(text).then((posts) => {
        setItems((prev) => mergeSlot(prev, posts, slot as 0 | 1));
      });
    });
  }, []);

  // Restore the last search on startup, if there is one.
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  return { items, initialQuery, search };
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
