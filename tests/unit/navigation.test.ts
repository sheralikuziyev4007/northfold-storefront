import { describe, expect, it } from 'vitest';
import { collectionLinks, footerNav, mainNav } from '@/lib/navigation';

const collections = [
  { handle: 'frontpage', title: 'Home page' },
  { handle: 'men', title: 'Men' },
  { handle: 'women', title: 'Women' },
  { handle: 'unisex', title: 'Unisex' },
  { handle: 'accessories', title: 'Accessories' },
  { handle: 'sale', title: 'Sale' },
];

describe('navigation', () => {
  it('builds menu links from the store collections, skipping the homepage collection', () => {
    expect(collectionLinks(collections)).toEqual([
      { href: '/collections/men', label: 'Men' },
      { href: '/collections/women', label: 'Women' },
      { href: '/collections/unisex', label: 'Unisex' },
      { href: '/collections/accessories', label: 'Accessories' },
    ]);
  });

  it('wraps the collections with New in and Journal', () => {
    const links = collectionLinks(collections, 1);
    expect(mainNav(links).map((l) => l.label)).toEqual(['New in', 'Men', 'Journal']);
    expect(footerNav(links)[0]?.links.map((l) => l.label)).toEqual(['New in', 'Men']);
  });
});
