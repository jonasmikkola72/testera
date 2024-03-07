import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { MdKeyboardCommandKey } from 'react-icons/md';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleClear = () => {
    setInputValue('');
    onSearch?.('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch?.(inputValue);
    }
  };

  return (
    <div className="search-bar">
      <AiOutlineSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder || 'Search or type a command'}
        value={inputValue}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        className="search-input"
      />
      {inputValue && (
        <AiOutlineClose onClick={handleClear} className="clear-icon" />
      )}
      <MdKeyboardCommandKey className="command-icon" />
    </div>
  );
};
