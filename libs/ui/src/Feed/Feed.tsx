/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Item } from '../Item/Item';
import type { PostData } from '../Post/Post';

export interface FeedProps {
  items: [PostData, PostData][];
}

const feedStyles = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export function Feed({ items }: FeedProps) {
  return (
    <Box css={feedStyles}>
      {items.map((posts, index) => (
        <Item key={index} posts={posts} />
      ))}
    </Box>
  );
}

export default Feed;
