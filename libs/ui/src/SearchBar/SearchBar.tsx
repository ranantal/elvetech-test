/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import Input from '@mui/material/Input';
import {
  Box,
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface SearchBarProps {
  history: string[];
  initialValue?: string;
  onSearch: (query: string) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (item: string) => void;
}

const historyItemStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .history-item-remove {
    opacity: 0;
  }

  &:hover .history-item-remove {
    opacity: 1;
  }
`;

const clearHistoryStyles = css`
  color: #d32f2f;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
`;

export function SearchBar({
  history,
  initialValue = '',
  onSearch,
  onClearHistory,
  onRemoveHistoryItem,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [historyOpen, setHistoryOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const runSearch = (query: string) => {
    setValue(query);
    setHistoryOpen(false);
    onSearch(query);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      runSearch(value);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setHistoryOpen(false)}>
      <Box ref={anchorRef}>
        <Input
          fullWidth
          placeholder="Search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setHistoryOpen(history.length > 0)}
        />
        <Popper
          open={historyOpen && history.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ width: anchorRef.current?.offsetWidth, zIndex: 2 }}
        >
          <Paper>
            <MenuList>
              {history.map((item) => (
                <MenuItem
                  key={item}
                  css={historyItemStyles}
                  onClick={() => runSearch(item)}
                >
                  <span>{item}</span>
                  <IconButton
                    className="history-item-remove"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveHistoryItem(item);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </MenuItem>
              ))}
              <MenuItem css={clearHistoryStyles} onClick={onClearHistory}>
                Clear history
              </MenuItem>
            </MenuList>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

export default SearchBar;
