'use client';

import { useEffect, useState } from 'react';
import { SearchIcon } from '@/components/ui/icons';
import { useUIStore } from '@/lib/stores/ui-store';

export function SearchTrigger() {
  const openSearch = useUIStore((s) => s.openSearch);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
        className="border-line bg-paper text-muted hover:border-ink hidden h-11 min-w-[220px] items-center gap-2.5 rounded-md border px-3.5 text-sm lg:flex"
      >
        <SearchIcon size={18} />
        <span className="flex-1 text-left">Search products</span>
        <kbd className="border-line rounded border px-1.5 py-px font-sans text-xs">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search products"
        className="grid size-11 place-items-center rounded-md lg:hidden"
      >
        <SearchIcon size={21} />
      </button>
    </>
  );
}
