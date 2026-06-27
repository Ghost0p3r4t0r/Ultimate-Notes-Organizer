import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '../api';
import { Search, Loader2, Folder, FileText, Tags, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'collection' | 'item' | 'tag' | 'note';
  title: string;
  subtitle?: string;
  url: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }
    setSelectedIndex(0);
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchApi.globalSearch(query);
        setResults(res);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((result: SearchResult) => {
    setOpen(false);
    navigate(result.url);
  }, [navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'collection': return <Folder className="h-4 w-4" />;
      case 'item': return <FileText className="h-4 w-4" />;
      case 'tag': return <Tags className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors w-full sm:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg rounded-xl border bg-popover shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search collections, items, tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && query.length > 0 && !loading && (
                <p className="py-8 text-center text-sm text-muted-foreground">No results found</p>
              )}
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                  )}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    {getIcon(result.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] uppercase text-muted-foreground">{result.type}</span>
                </button>
              ))}
            </div>
            <div className="border-t px-4 py-2">
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span><kbd className="rounded border px-1 py-0.5">↑↓</kbd> Navigate</span>
                <span><kbd className="rounded border px-1 py-0.5">↵</kbd> Open</span>
                <span><kbd className="rounded border px-1 py-0.5">Esc</kbd> Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
