/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Card, CardContent, Skeleton } from '@mui/material';

const cardStyles = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const mediaSkeletonStyles = css`
  width: 100%;
  height: 300px;
  flex-shrink: 0;
`;

const tagsStyles = css`
  display: flex;
  gap: 4px;
`;

// Mirrors Post's shape while its data is still loading.
export function PostSkeleton() {
  return (
    <Card css={cardStyles}>
      <Skeleton variant="rectangular" css={mediaSkeletonStyles} />
      <CardContent css={tagsStyles}>
        <Skeleton variant="rounded" width={56} height={24} />
        <Skeleton variant="rounded" width={72} height={24} />
        <Skeleton variant="rounded" width={48} height={24} />
      </CardContent>
    </Card>
  );
}

export default PostSkeleton;
