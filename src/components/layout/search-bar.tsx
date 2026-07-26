'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { debounce } from '@/lib/utils';

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ onClose, autoFocus = true }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = debounce((value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
      onClose?.();
    }
  }, 500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search movies, TV shows..."
          className="w-full pl-12 pr-12 py-3 bg-gray-900/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}
