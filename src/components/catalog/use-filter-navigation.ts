'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { filtersToSearchParams, PAGE_SIZE, type CatalogFilters } from '@/lib/catalog/filters';

/** Writes filter changes to the URL so results are shareable and survive a reload. */
export function useFilterNavigation(filters: CatalogFilters) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function apply(patch: Partial<CatalogFilters>) {
    // Any change to the result set starts again from the first page.
    const next = { ...filters, show: PAGE_SIZE, ...patch };
    const qs = filtersToSearchParams(next).toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function toggle(key: 'sizes' | 'colors', value: string) {
    const current = filters[key];
    apply({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  }

  function clear() {
    apply({ sizes: [], colors: [], minPrice: null, maxPrice: null });
  }

  return { apply, toggle, clear, pending };
}
