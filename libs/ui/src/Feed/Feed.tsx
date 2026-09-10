/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Box } from '@mui/material';
import { Item, type ItemPosts } from '../Item/Item';

export interface FeedProps {
  items: ItemPosts[];
  loading?: boolean;
}

const scrollContainerStyles = css`
  height: 100%;
  overflow-y: auto;
`;

const listStyles = css`
  position: relative;
  width: 100%;
`;

// Rows are absolutely positioned by the virtualizer, so the bottom gap
// between rows lives here (measureElement includes it in each row's height)
// rather than as a flex `gap` on the list.
const rowStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-bottom: 16px;
`;

const ESTIMATED_ROW_HEIGHT = 400;

const LOADING_ITEM: ItemPosts = [undefined, undefined];

export function Feed({ items, loading }: FeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showLoadingRow = loading && items.length === 0;
  const rows = showLoadingRow ? [LOADING_ITEM] : items;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
  });

  return (
    <Box ref={scrollRef} css={scrollContainerStyles}>
      <Box css={listStyles} style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <Box
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            css={rowStyles}
            style={{ transform: `translateY(${virtualRow.start}px)` }}
          >
            <Item posts={rows[virtualRow.index]} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Feed;
