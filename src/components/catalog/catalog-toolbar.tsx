'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloseIcon, SlidersIcon } from '@/components/ui/icons';
import { Sheet } from '@/components/ui/sheet';
import { activeFilterCount, SORT_OPTIONS, type CatalogFilters } from '@/lib/catalog/filters';
import { FilterControls, type Facets } from './filter-controls';
import { useFilterNavigation } from './use-filter-navigation';

export function SortSelect({ filters }: { filters: CatalogFilters }) {
  const { apply } = useFilterNavigation(filters);
  return (
    <div className="hidden flex-col gap-1.5 lg:flex">
      <label htmlFor="sort" className="text-[13px] font-semibold">
        Sort by
      </label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(e) => apply({ sort: e.target.value as CatalogFilters['sort'] })}
        className="border-line bg-paper h-11 min-w-[200px] rounded-md border px-3 text-[15px]"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function MobileFilterButton({
  filters,
  facets,
  currencySymbol,
  resultCount,
}: {
  filters: CatalogFilters;
  facets: Facets;
  currencySymbol: string;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);
  const { clear, pending } = useFilterNavigation(filters);
  const count = activeFilterCount(filters);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="lg:hidden">
        <SlidersIcon size={18} />
        Filter and sort{count ? ` (${count})` : ''}
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} label="Filter and sort" placement="bottom">
        <div className="flex max-h-[calc(100dvh-56px)] flex-col">
          <div className="border-line flex items-center justify-between border-b py-2 pr-2 pl-5">
            <h2 className="font-semiwide text-xl font-extrabold">Filter and sort</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="grid size-11 place-items-center"
            >
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <FilterControls
              filters={filters}
              facets={facets}
              currencySymbol={currencySymbol}
              showSort
              idPrefix="m"
            />
          </div>
          <div className="border-line bg-paper flex gap-2.5 border-t px-5 pt-3 pb-6">
            <Button variant="secondary" onClick={clear}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)} aria-busy={pending}>
              {pending
                ? 'Updating…'
                : resultCount === 0
                  ? 'No products match'
                  : `Show ${resultCount} ${resultCount === 1 ? 'product' : 'products'}`}
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}

export function ActiveFilters({
  filters,
  currencySymbol,
}: {
  filters: CatalogFilters;
  currencySymbol: string;
}) {
  const { apply, toggle, clear } = useFilterNavigation(filters);
  if (!activeFilterCount(filters)) return null;

  const chips = [
    ...filters.sizes.map((v) => ({ label: `Size ${v}`, remove: () => toggle('sizes', v) })),
    ...filters.colors.map((v) => ({ label: v, remove: () => toggle('colors', v) })),
    ...(filters.minPrice != null
      ? [{ label: `From ${currencySymbol}${filters.minPrice}`, remove: () => apply({ minPrice: null }) }]
      : []),
    ...(filters.maxPrice != null
      ? [{ label: `Up to ${currencySymbol}${filters.maxPrice}`, remove: () => apply({ maxPrice: null }) }]
      : []),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.remove}
          aria-label={`Remove filter: ${chip.label}`}
          className="bg-ink text-paper inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm"
        >
          {chip.label}
          <CloseIcon size={12} strokeWidth={2.2} />
        </button>
      ))}
      <button type="button" onClick={clear} className="h-9 px-2 text-sm underline underline-offset-2">
        Clear all
      </button>
    </div>
  );
}
