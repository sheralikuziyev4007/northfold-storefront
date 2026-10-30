/**
 * Collection filtering and sorting. Kept as pure functions over normalized products so the
 * same logic works for any Storefront API source and is easy to unit test.
 */
import type { Product, ProductSort } from '@/lib/shopify/types';

export type CatalogFilters = {
  sizes: string[];
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: ProductSort;
  show: number;
};

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
];

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

type Params = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(',') : (value ?? '');
  return [
    ...new Set(
      raw
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
}

function positiveNumber(value: string | undefined): number | null {
  if (value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseFilters(params: Params): CatalogFilters {
  const sort = first(params.sort);
  const show = Number(first(params.show));
  return {
    sizes: list(params.size),
    colors: list(params.color),
    minPrice: positiveNumber(first(params.min)),
    maxPrice: positiveNumber(first(params.max)),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as ProductSort) : 'featured',
    show: Number.isInteger(show) && show > 0 ? Math.min(show, 96) : PAGE_SIZE,
  };
}

/** Serializes filters back to a query string, dropping defaults so URLs stay short. */
export function filtersToSearchParams(filters: Partial<CatalogFilters>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.sizes?.length) params.set('size', filters.sizes.join(','));
  if (filters.colors?.length) params.set('color', filters.colors.join(','));
  if (filters.minPrice != null) params.set('min', String(filters.minPrice));
  if (filters.maxPrice != null) params.set('max', String(filters.maxPrice));
  if (filters.sort && filters.sort !== 'featured') params.set('sort', filters.sort);
  if (filters.show && filters.show !== PAGE_SIZE) params.set('show', String(filters.show));
  return params;
}

const isOption = (name: string, kind: 'size' | 'color') =>
  kind === 'size' ? /^size$/i.test(name) : /^colou?r$/i.test(name);

export function optionValue(product: Product['variants'][number], kind: 'size' | 'color') {
  return product.selectedOptions.find((o) => isOption(o.name, kind))?.value;
}

export function minPrice(product: Product): number {
  return Number(product.priceRange.min.amount);
}

export function applyFilters(products: Product[], filters: CatalogFilters): Product[] {
  const result = products.filter((product) => {
    const variants = product.variants.filter((v) => {
      if (!v.availableForSale && (filters.sizes.length || filters.colors.length)) return false;
      const size = optionValue(v, 'size');
      const color = optionValue(v, 'color');
      if (filters.sizes.length && (!size || !filters.sizes.includes(size))) return false;
      if (filters.colors.length && (!color || !filters.colors.includes(color))) return false;
      return true;
    });
    if (!variants.length) return false;
    const price = minPrice(product);
    if (filters.minPrice != null && price < filters.minPrice) return false;
    if (filters.maxPrice != null && price > filters.maxPrice) return false;
    return true;
  });

  switch (filters.sort) {
    case 'newest':
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc':
      return result.sort((a, b) => minPrice(a) - minPrice(b));
    case 'price-desc':
      return result.sort((a, b) => minPrice(b) - minPrice(a));
    default:
      return result;
  }
}

export type Facet = { value: string; count: number };

/** Option values present in the unfiltered collection, with product counts. */
export function buildFacets(products: Product[]): { sizes: Facet[]; colors: Facet[] } {
  const tally = (kind: 'size' | 'color') => {
    const counts = new Map<string, number>();
    for (const product of products) {
      const values = new Set(product.variants.map((v) => optionValue(v, kind)).filter(Boolean) as string[]);
      for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts].map(([value, count]) => ({ value, count }));
  };
  const sizes = tally('size').sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a.value);
    const ib = SIZE_ORDER.indexOf(b.value);
    if (ia === -1 && ib === -1) return a.value.localeCompare(b.value);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  const colors = tally('color').sort((a, b) => a.value.localeCompare(b.value));
  return { sizes, colors };
}

export function activeFilterCount(filters: CatalogFilters): number {
  return (
    filters.sizes.length +
    filters.colors.length +
    (filters.minPrice != null ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0)
  );
}
