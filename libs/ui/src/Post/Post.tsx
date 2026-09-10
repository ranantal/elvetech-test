/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card, CardContent, CardMedia } from '@mui/material';
import { TagList } from './TagList';

export interface PostData {
  url: string;
  width: number;
  height: number;
  tags: string[];
}

export interface PostProps {
  post: PostData;
}

const cardStyles = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const mediaStyles = css`
  width: 100%;
  height: 300px;
  flex-shrink: 0;
  object-fit: contain;
  background-color: #fff;
`;

export function Post({ post }: PostProps) {
  return (
    <Card css={cardStyles}>
      <CardMedia
        component="img"
        image={post.url}
        alt={post.tags.join(', ')}
        css={mediaStyles}
      />
      <CardContent>
        <TagList tags={post.tags} />
      </CardContent>
    </Card>
  );
}

export default Post;
