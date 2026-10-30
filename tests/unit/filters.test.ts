import { describe, expect, it } from 'vitest';
import {
  activeFilterCount,
  applyFilters,
  buildFacets,
  filtersToSearchParams,
  PAGE_SIZE,
  parseFilters,
} from '@/lib/catalog/filters';
import { allFixtureProducts } from './helpers';

const products = allFixtureProducts();

describe('parseFilters', () => {
  it('returns defaults for empty params', () => {
    expect(parseFilters({})).toEqual({
      sizes: [],
      colors: [],
      minPrice: null,
      maxPrice: null,
      sort: 'featured',
      show: PAGE_SIZE,
    });
  });

  it('reads comma lists, dedupes them and ignores unknown sort values', () => {
    const filters = parseFilters({
      size: 'M,L,M',
      color: ['Loden'],
      sort: 'cheapest',
      min: '40',
      max: '-5',
      show: '24',
    });
    expect(filters).toMatchObject({
      sizes: ['M', 'L'],
      colors: ['Loden'],
      sort: 'featured',
      minPrice: 40,
      maxPrice: null,
      show: 24,
    });
  });

  it('caps the page size', () => {
    expect(parseFilters({ show: '5000' }).show).toBe(96);
  });
});

describe('filtersToSearchParams', () => {
  it('round-trips and drops defaults', () => {
    const filters = parseFilters({ size: 'S,M', color: 'Oat', sort: 'price-asc', min: '10' });
    const params = filtersToSearchParams(filters);
    expect(params.toString()).toBe('size=S%2CM&color=Oat&min=10&sort=price-asc');
    expect(parseFilters(Object.fromEntries(params))).toEqual(filters);
  });
});

describe('applyFilters', () => {
  it('matches products that have an in-stock variant in the chosen size', () => {
    const result = applyFilters(products, parseFilters({ size: 'XL' }));
    // The hoodie is sold out in XL in every colour, so it must not appear.
    expect(result.map((p) => p.handle)).not.toContain('heavyweight-hoodie');
    expect(result.map((p) => p.handle)).toContain('boxy-pocket-tee');
  });

  it('combines size and colour on the same variant', () => {
    const result = applyFilters(products, parseFilters({ size: 'M', color: 'Charcoal' }));
    // The chore jacket has Charcoal and M, but Charcoal/M is sold out.
    expect(result.map((p) => p.handle)).not.toContain('canvas-chore-jacket');
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters by price range and sorts by price', () => {
    const result = applyFilters(products, parseFilters({ min: '40', max: '90', sort: 'price-asc' }));
    const prices = result.map((p) => Number(p.priceRange.min.amount));
    expect(prices.every((p) => p >= 40 && p <= 90)).toBe(true);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts newest first', () => {
    const result = applyFilters(products, parseFilters({ sort: 'newest' }));
    expect(result[0]?.handle).toBe('heavyweight-hoodie');
  });

  it('returns nothing when no product matches', () => {
    expect(applyFilters(products, parseFilters({ color: 'Purple' }))).toEqual([]);
  });
});

describe('buildFacets', () => {
  it('orders apparel sizes logically and counts colours by product', () => {
    const { sizes, colors } = buildFacets(products);
    expect(sizes.slice(0, 6).map((s) => s.value)).toEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    expect(colors.find((c) => c.value === 'Khaki')).toEqual({ value: 'Khaki', count: 1 });
  });
});

describe('activeFilterCount', () => {
  it('counts each value and each price bound', () => {
    expect(activeFilterCount(parseFilters({ size: 'S,M', color: 'Oat', min: '1', max: '2' }))).toBe(5);
  });
});
