/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Item, type ItemPosts } from '../Item/Item';

export interface FeedProps {
  items: ItemPosts[];
  loading?: boolean;
}

const feedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LOADING_ITEM: ItemPosts = [undefined, undefined];

export function Feed({ items, loading }: FeedProps) {
  const showLoadingRow = loading && items.length === 0;

  return (
    <Box css={feedStyles}>
      {showLoadingRow && <Item posts={LOADING_ITEM} />}
      {items.map((posts, index) => (
        <Item key={index} posts={posts} />
      ))}
    </Box>
  );
}

export default Feed;
