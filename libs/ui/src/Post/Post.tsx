/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useDownloadHandler } from '@elvetech/platform';
import { TagList } from './TagList';
import { useNotifyError } from '../NotificationsContext';

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

const mediaWrapperStyles = css`
  position: relative;
  width: 100%;
  height: 300px;
  flex-shrink: 0;

  .post-download-button {
    opacity: 0;
  }

  &:hover .post-download-button {
    opacity: 1;
  }
`;

const mediaStyles = css`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #fff;
`;

const downloadButtonStyles = css`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.8);

  &:hover {
    background-color: rgba(255, 255, 255, 0.95);
  }
`;

function getFilename(post: PostData): string {
  const { pathname } = new URL(post.url);
  const extensionMatch = /\.(\w+)$/.exec(pathname);
  const extension = extensionMatch ? extensionMatch[1] : 'jpg';
  const base = post.tags.slice(0, 3).join('-') || 'image';

  return `${base}.${extension}`;
}

export function Post({ post }: PostProps) {
  const downloadHandler = useDownloadHandler();
  const notifyError = useNotifyError();

  const handleDownload = async () => {
    try {
      await downloadHandler?.download(post.url, getFilename(post));
    } catch {
      notifyError('Failed to download file');
    }
  };

  return (
    <Card css={cardStyles}>
      <Box css={mediaWrapperStyles}>
        <CardMedia
          component="img"
          image={post.url}
          alt={post.tags.join(', ')}
          css={mediaStyles}
        />
        {downloadHandler && (
          <IconButton
            className="post-download-button"
            css={downloadButtonStyles}
            size="small"
            onClick={handleDownload}
          >
            <DownloadIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
      <CardContent>
        <TagList tags={post.tags} />
      </CardContent>
    </Card>
  );
}

export default Post;
