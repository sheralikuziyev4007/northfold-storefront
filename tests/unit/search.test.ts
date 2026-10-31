import { describe, expect, it } from 'vitest';
import { filterProductsByQuery } from '@/lib/catalog/search';
import { allFixtureProducts } from './helpers';

const products = allFixtureProducts();
const titles = (query: string) => filterProductsByQuery(products, query).map((p) => p.title);

describe('filterProductsByQuery', () => {
  it('keeps only products that match the query', () => {
    expect(titles('jacket')).toEqual(['Canvas chore jacket', 'Quilted liner jacket']);
  });

  it('matches plurals, any case and every word of the query', () => {
    expect(titles('JACKETS')).toEqual(['Canvas chore jacket', 'Quilted liner jacket']);
    expect(titles('quilted jacket')).toEqual(['Quilted liner jacket']);
  });

  it('ranks products whose title starts with the query first', () => {
    expect(titles('tee')[0]).toBe('Boxy pocket tee');
    expect(titles('canvas')).toEqual(['Canvas chore jacket', 'Canvas tote']);
  });

  it('returns nothing for blank or unmatched queries', () => {
    expect(titles('   ')).toEqual([]);
    expect(titles('parachute')).toEqual([]);
  });
});
