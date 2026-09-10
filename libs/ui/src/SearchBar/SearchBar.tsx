import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import Input from '@mui/material/Input';

export interface SearchBarProps {
  history: string[];
  onSearch: (query: string) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (item: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <Input
      fullWidth
      placeholder="Search"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

export default SearchBar;
