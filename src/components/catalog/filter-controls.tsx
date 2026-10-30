'use client';

import { useState } from 'react';
import { swatchFor } from '@/lib/catalog/swatches';
import { SORT_OPTIONS, type CatalogFilters, type Facet } from '@/lib/catalog/filters';
import { cn } from '@/lib/utils';
import { useFilterNavigation } from './use-filter-navigation';

export type Facets = { sizes: Facet[]; colors: Facet[] };

function PriceInput({
  id,
  label,
  value,
  onCommit,
}: {
  id: string;
  label: string;
  value: number | null;
  onCommit: (value: number | null) => void;
}) {
  const [draft, setDraft] = useState(value == null ? '' : String(value));
  const commit = () => {
    const n = draft.trim() === '' ? null : Number(draft);
    if (n === null || (Number.isFinite(n) && n >= 0)) {
      if (n !== value) onCommit(n);
    } else setDraft(value == null ? '' : String(value));
  };
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-muted text-[13px]">
        {label}
      </label>
      <input
        id={id}
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d.]/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        placeholder={label === 'Min' ? '0' : 'Any'}
        className="border-line bg-paper h-11 w-full rounded border px-2.5 text-base"
      />
    </div>
  );
}

export function FilterControls({
  filters,
  facets,
  currencySymbol,
  showSort = false,
  idPrefix,
}: {
  filters: CatalogFilters;
  facets: Facets;
  currencySymbol: string;
  showSort?: boolean;
  idPrefix: string;
}) {
  const { apply, toggle } = useFilterNavigation(filters);

  return (
    <div className="flex flex-col gap-8">
      {showSort ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 p-0 text-[15px] font-bold">Sort by</legend>
          <div className="flex flex-col">
            {SORT_OPTIONS.map((o) => (
              <label key={o.value} className="flex min-h-11 items-center gap-3 text-[15px]">
                <input
                  type="radio"
                  name={`${idPrefix}-sort`}
                  checked={filters.sort === o.value}
                  onChange={() => apply({ sort: o.value })}
                  className="accent-ink m-0 size-5"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {facets.sizes.length ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 p-0 text-[15px] font-bold">Size</legend>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
            {facets.sizes.map((f) => {
              const on = filters.sizes.includes(f.value);
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle('sizes', f.value)}
                  className={cn(
                    'h-11 rounded border-[1.5px] px-1 text-sm font-semibold',
                    on ? 'border-ink bg-ink text-paper' : 'border-line bg-paper hover:border-ink',
                  )}
                >
                  {f.value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {facets.colors.length ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 p-0 text-[15px] font-bold">Colour</legend>
          <div className="flex flex-col gap-1">
            {facets.colors.map((f) => {
              const on = filters.colors.includes(f.value);
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle('colors', f.value)}
                  className={cn(
                    'hover:bg-paper flex min-h-10 items-center gap-3 rounded px-2 text-left text-[15px]',
                    on && 'bg-paper',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-5 flex-none rounded-full',
                      on
                        ? 'shadow-[0_0_0_2px_var(--color-stone),0_0_0_4px_var(--color-ink)]'
                        : 'shadow-[inset_0_0_0_1px_rgb(30_36_34/0.25)]',
                    )}
                    style={{ background: swatchFor(f.value) }}
                  />
                  <span className="flex-1">{f.value}</span>
                  <span className="text-muted text-[13px]">{f.count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 p-0 text-[15px] font-bold">Price ({currencySymbol})</legend>
        <div className="flex gap-2">
          <PriceInput
            key={`min-${filters.minPrice}`}
            id={`${idPrefix}-min`}
            label="Min"
            value={filters.minPrice}
            onCommit={(v) => apply({ minPrice: v })}
          />
          <PriceInput
            key={`max-${filters.maxPrice}`}
            id={`${idPrefix}-max`}
            label="Max"
            value={filters.maxPrice}
            onCommit={(v) => apply({ maxPrice: v })}
          />
        </div>
      </fieldset>
    </div>
  );
}
