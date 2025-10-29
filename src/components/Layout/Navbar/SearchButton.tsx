'use client';

import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 rounded-full hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Pesquisar produtos"
        >
          <Search size={24} className="text-background" />
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-background/10 rounded-full px-4 py-2 backdrop-blur-sm border-2 border-background/30">
          <Search size={20} className="text-background/70" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pesquisar produtos..."
            className="bg-transparent text-background placeholder-background/60 outline-none w-48 text-sm"
            aria-label="Campo de pesquisa"
          />
          <button
            onClick={() => {
              setIsExpanded(false);
              setSearchQuery('');
            }}
            className="p-1 hover:bg-background/20 rounded-full transition-colors"
            aria-label="Fechar pesquisa"
          >
            <X size={18} className="text-background" />
          </button>
        </div>
      )}
    </div>
  );
}
