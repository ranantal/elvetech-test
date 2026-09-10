/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Post, type PostData } from '../Post/Post';
import { PostSkeleton } from '../Post/PostSkeleton';

// A slot is `undefined` while its post is still loading — results for the
// two underlying queries can arrive in either order.
export type ItemPosts = [PostData | undefined, PostData | undefined];

export interface ItemProps {
  posts: ItemPosts;
}

// Default cross-axis "stretch" keeps both posts the same height as
// whichever one is currently taller (e.g. after "show more"), so a
// card expanding down doesn't leave its neighbor looking mismatched.
const rowStyles = css`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const postWrapperStyles = css`
  width: 45%;
`;

export function Item({ posts }: ItemProps) {
  const [first, second] = posts;

  return (
    <Box css={rowStyles}>
      <Box css={postWrapperStyles}>
        {first ? <Post post={first} /> : <PostSkeleton />}
      </Box>
      <Box css={postWrapperStyles}>
        {second ? <Post post={second} /> : <PostSkeleton />}
      </Box>
    </Box>
  );
}

export default Item;
