/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Feed, SearchBar } from '@elvetech/ui';
import { useSearch } from './useSearch';

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

export function AppShell() {
  const { items, initialQuery, search } = useSearch();

  return (
    <Box>
      <Box css={headerStyles}>
        <SearchBar
          history={[]}
          initialValue={initialQuery}
          onSearch={search}
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
