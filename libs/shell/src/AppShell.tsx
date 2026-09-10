/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Feed, SearchBar, type PostData } from '@elvetech/ui';

const headerStyles = css`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
  padding: 16px;
`;

const contentStyles = css`
  padding: 16px;
`;

const posts: PostData[] = [
  {
    url: 'https://media.istockphoto.com/id/1361544248/photo/excited-cat-looking-looking-up.jpg?s=612x612&w=0&k=20&c=YIZMf4W0gZpPMZ4KXZ5EUol8TNOP87aToKorE9i3HoU=',
    width: 612,
    height: 408,
    tags: [
      'excited',
      'cat',
      'looking',
      'up',
      'stock',
      'pictures',
      'royalty',
      'free',
      'photos',
      'images',
      'istockphoto',
      'com',
    ],
  },
  {
    url: 'https://t3.ftcdn.net/jpg/05/64/71/88/360_F_564718897_lcH1xHumpiscCc46HNGX79pEeMtT9dJN.jpg',
    width: 491,
    height: 360,
    tags: [
      'png',
      'cute',
      'tabby',
      'cat',
      'plays',
      'with',
      'its',
      'paw',
      'the',
      'raised',
      'and',
      'carefully',
      'looks',
      'at',
      'object',
      'stock',
      'adobe',
      'com',
    ],
  },
  {
    url: 'https://media.gettyimages.com/id/sb10069719c-001/photo/tabby-cat-standing-on-hind-legs-with-stretching-out-paw.jpg?s=612x612&w=0&k=20&c=fKfO888I6uNzbZPIzujA6qRb12V5bdAA9fq_Is9ovvw=',
    width: 459,
    height: 612,
    tags: [
      'tabby',
      'cat',
      'standing',
      'on',
      'hind',
      'legs',
      'with',
      'stretching',
      'out',
      'paw',
      'stock',
      'pictures',
      'royalty',
      'free',
      'photos',
      'images',
      'gettyimages',
      'com',
    ],
  },
  {
    url: 'https://marketplace.canva.com/MADfWuEIQAE/1/thumbnail_large/canva-orange-tabby-cat-lying-down-cutout-MADfWuEIQAE.png',
    width: 550,
    height: 187,
    tags: ['orange', 'tabby', 'cat', 'lying', 'down', 'cutout', 'canva', 'com'],
  },
];

const items: [PostData, PostData][] = [
  [posts[0], posts[1]],
  [posts[2], posts[3]],
];

export function AppShell() {
  return (
    <Box>
      <Box css={headerStyles}>
        <SearchBar
          history={[]}
          onSearch={console.log}
          onClearHistory={() => {}}
          onRemoveHistoryItem={() => {}}
        />
      </Box>
      <Box css={contentStyles}>
        <Feed items={items} />
      </Box>
    </Box>
  );
}

export default AppShell;
