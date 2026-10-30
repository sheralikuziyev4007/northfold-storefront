'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { SearchResult } from '@/app/api/search/route';
import { SearchIcon, SpinnerIcon } from '@/components/ui/icons';
import { Sheet } from '@/components/ui/sheet';
import { track } from '@/lib/analytics';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';

const SUGGESTED = [
  { href: '/collections/outerwear', label: 'Outerwear' },
  { href: '/collections/essentials', label: 'Essentials' },
  { href: '/collections/accessories', label: 'Accessories' },
];

type Status = 'idle' | 'loading' | 'done' | 'error';

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStatus('idle');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { results: SearchResult[] };
        setResults(data.results);
        setActive(0);
        setStatus('done');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setStatus('error');
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function submitAll() {
    const q = query.trim();
    if (!q) return;
    track({ name: 'search', search_term: q });
    go(`/search?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = results[active];
      if (picked) {
        track({ name: 'search', search_term: query.trim() });
        go(`/products/${picked.handle}`);
      } else submitAll();
    }
  }

  const showResults = status === 'done' && results.length > 0;

  return (
    <div className="bg-paper flex max-h-[76vh] flex-col">
      <div className="border-line-soft flex items-center gap-3 border-b px-5">
        {status === 'loading' ? (
          <SpinnerIcon size={20} className="text-muted" />
        ) : (
          <SearchIcon size={20} className="text-muted" />
        )}
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <input
          ref={inputRef}
          id="site-search"
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showResults ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search hoodies, tees, jackets…"
          className="placeholder:text-muted h-16 flex-1 bg-transparent text-lg outline-none"
        />
        <kbd className="border-line text-muted rounded border px-1.5 py-0.5 font-sans text-xs">Esc</kbd>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto p-3">
        {status === 'error' ? (
          <p role="alert" className="px-2 py-6 text-[15px]">
            Search is unavailable right now. Try again in a moment.
          </p>
        ) : null}

        {status === 'done' && results.length === 0 ? (
          <div className="flex flex-col gap-1.5 px-2 py-6">
            <p className="text-base font-bold">No products match “{query.trim()}”</p>
            <p className="text-muted text-sm">Check the spelling or try a broader word, like “jacket”.</p>
          </div>
        ) : null}

        {showResults ? (
          <>
            <span className="text-muted px-2 pt-2 pb-1 text-[13px] font-semibold">Products</span>
            <ul id={listId} role="listbox" aria-label="Products">
              {results.map((r, i) => (
                <li
                  key={r.handle}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                >
                  <Link
                    href={`/products/${r.handle}`}
                    tabIndex={-1}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3.5 rounded-md p-2 no-underline',
                      i === active && 'bg-mist',
                    )}
                  >
                    <span className="bg-tone-oat relative h-[60px] w-12 flex-none overflow-hidden rounded-[3px]">
                      {r.image ? (
                        <Image src={r.image.url} alt="" fill sizes="48px" className="object-cover" />
                      ) : null}
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="text-[15px] font-semibold">{r.title}</span>
                      <span className="text-muted text-[13px]">{r.productType}</span>
                    </span>
                    <span className="text-[15px] font-semibold">{r.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={submitAll}
              className="mx-2 mt-1 self-start text-sm font-semibold underline underline-offset-4"
            >
              See all results for “{query.trim()}”
            </button>
          </>
        ) : null}

        <span className="text-muted px-2 pt-3 pb-1 text-[13px] font-semibold">Collections</span>
        <div className="flex flex-wrap gap-2 px-2 pb-2">
          {SUGGESTED.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={onClose}
              className="border-line hover:border-ink inline-flex h-9 items-center rounded-full border px-3.5 text-sm no-underline"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-line-soft bg-mist text-muted hidden gap-4.5 border-t px-5 py-3 text-[13px] sm:flex">
        <span>↑ ↓ to move</span>
        <span>Enter to open</span>
        <span>Esc to close</span>
      </div>
    </div>
  );
}

export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen);
  const close = useUIStore((s) => s.closeSearch);
  return (
    <Sheet open={open} onClose={close} label="Search products" placement="top-center">
      <SearchPanel onClose={close} />
    </Sheet>
  );
}
