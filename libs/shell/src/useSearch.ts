import { useCallback, useState } from 'react';
import { SearchService } from '@elvetech/data-access';
import type { ItemPosts, PostData } from '@elvetech/ui';

const searchService = new SearchService();

export interface UseSearchResult {
  items: ItemPosts[];
  search: (query: string) => void;
}

// Runs the plain query and the `<query> graffiti` query side by side and
// zips their results index-by-index into item pairs, publishing a slot as
// soon as its query resolves rather than waiting for both.
export function useSearch(): UseSearchResult {
  const [items, setItems] = useState<ItemPosts[]>([]);

  const search = useCallback((query: string) => {
    setItems([]);

    [query, `${query} graffiti`].forEach((text, slot) => {
      searchService.search<PostData>(text).then((posts) => {
        setItems((prev) => mergeSlot(prev, posts, slot as 0 | 1));
      });
    });
  }, []);

  return { items, search };
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
