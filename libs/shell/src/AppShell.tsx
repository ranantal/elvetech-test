/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Feed, SearchBar } from '@elvetech/ui';
import {
  PlatformServicesProvider,
  type PlatformServices,
} from '@elvetech/platform';
import { useSearch } from './useSearch';

const rootStyles = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const headerStyles = css`
  flex-shrink: 0;
  z-index: 1;
  background-color: #fff;
  padding: 16px;
`;

const contentStyles = css`
  flex: 1;
  min-height: 0;
  padding: 16px;
  box-sizing: border-box;
`;

export interface AppShellProps {
  services: PlatformServices;
}

export function AppShell({ services }: AppShellProps) {
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
    <PlatformServicesProvider services={services}>
      <Box css={rootStyles}>
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
    </PlatformServicesProvider>
  );
}

export default AppShell;
