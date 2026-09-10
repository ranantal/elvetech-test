/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Post, type PostData } from '../Post/Post';

export interface ItemProps {
  posts: [PostData, PostData];
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
        <Post post={first} />
      </Box>
      <Box css={postWrapperStyles}>
        <Post post={second} />
      </Box>
    </Box>
  );
}

export default Item;
