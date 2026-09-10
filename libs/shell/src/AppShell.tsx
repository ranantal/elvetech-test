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
  const {
    items,
    initialQuery,
    history,
    loading,
    search,
    removeFromHistory,
    clearHistory,
  } = useSearch();

  return (
    <Box>
      <Box css={headerStyles}>
        <SearchBar
          history={history}
          initialValue={initialQuery}
          onSearch={search}
          onClearHistory={clearHistory}
          onRemoveHistoryItem={removeFromHistory}
        />
      </Box>
      <Box css={contentStyles}>
        <Feed items={items} loading={loading} />
      </Box>
    </Box>
  );
}

export default AppShell;
