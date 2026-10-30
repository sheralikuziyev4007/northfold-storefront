import { describe, expect, it } from 'vitest';
import { hasLabel, normalizeImage, normalizeLabel, normalizeProduct } from '@/lib/shopify/normalize';
import type { RawProduct } from '@/lib/shopify/raw-types';

const raw: RawProduct = {
  id: 'gid://shopify/Product/1',
  handle: 'plain-tee',
  title: 'Plain tee',
  description: 'A tee.',
  productType: 'T-shirts',
  vendor: 'Northfold',
  tags: [],
  createdAt: '2026-01-01T00:00:00Z',
  availableForSale: true,
  featuredImage: null,
  images: { nodes: [{ url: 'https://cdn.shopify.com/a.jpg', altText: null, width: null, height: null }] },
  options: [{ id: 'o1', name: 'Title', optionValues: [{ name: 'Default Title' }] }],
  variants: {
    nodes: [
      {
        id: 'v1',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        price: { amount: '30.0', currencyCode: 'USD' },
        compareAtPrice: null,
        image: null,
      },
    ],
  },
  priceRange: {
    minVariantPrice: { amount: '30.0', currencyCode: 'USD' },
    maxVariantPrice: { amount: '30.0', currencyCode: 'USD' },
  },
  metafields: [null, { key: 'composition', value: ' 100% cotton ' }, { key: 'unknown', value: 'x' }],
  seo: null,
};

describe('normalizeProduct', () => {
  const product = normalizeProduct(raw);

  it('removes Shopify’s placeholder "Default Title" option', () => {
    expect(product.options).toEqual([]);
  });

  it('falls back to the first image and generates alt text', () => {
    expect(product.featuredImage).toEqual({
      url: 'https://cdn.shopify.com/a.jpg',
      altText: 'Plain tee, view 1',
      width: 1200,
      height: 1500,
    });
  });

  it('fills SEO fields from the product', () => {
    expect(product.seo).toEqual({ title: 'Plain tee', description: 'A tee.' });
  });

  it('reads label metafields and ignores nulls and unknown keys', () => {
    expect(product.label.composition).toBe('100% cotton');
    expect(product.label.origin).toBeNull();
    expect(hasLabel(product.label)).toBe(true);
  });
});

describe('helpers', () => {
  it('normalizeImage returns null without a url', () => {
    expect(normalizeImage(null, 'x')).toBeNull();
  });

  it('normalizeLabel handles a missing metafields list', () => {
    expect(hasLabel(normalizeLabel(null))).toBe(false);
  });
});
