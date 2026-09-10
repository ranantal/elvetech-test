import { useCallback, useEffect, useState } from 'react';
import { SearchHistory } from '@elvetech/data-access';

const defaultSearchHistory = new SearchHistory();

export interface UseHistoryResult {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

// searchHistory is injectable, same DI pattern as useSearch, so this hook
// can be tested with a fake instead of mocking the module.
export function useHistory(
  searchHistory: SearchHistory = defaultSearchHistory,
): UseHistoryResult {
  const [history, setHistory] = useState<string[]>([]);

  const refreshHistory = useCallback(() => {
    searchHistory.getRecent().then(setHistory);
  }, [searchHistory]);

  const addToHistory = useCallback(
    (query: string) => {
      searchHistory.add(query).then(refreshHistory);
    },
    [searchHistory, refreshHistory],
  );

  const removeFromHistory = useCallback(
    (query: string) => {
      searchHistory.remove(query).then(refreshHistory);
    },
    [searchHistory, refreshHistory],
  );

  const clearHistory = useCallback(() => {
    searchHistory.clear().then(refreshHistory);
  }, [searchHistory, refreshHistory]);

  // Load the persisted history on mount.
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
