import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ARTICLES } from '@/content/journal';
import { HERO_PHOTO } from '@/content/photos';
import {
  buildRawCollection,
  buildRawProduct,
  COLLECTION_SPECS,
  PRODUCT_SPECS,
} from '@/lib/shopify/fixtures/catalog';

const PUBLIC = join(process.cwd(), 'public');

function isWebp(path: string) {
  const header = readFileSync(join(PUBLIC, path)).subarray(0, 12);
  return header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP';
}

const localImages = [
  ...PRODUCT_SPECS.flatMap((spec) => buildRawProduct(spec, 'USD').images.nodes.map((img) => img.url)),
  ...COLLECTION_SPECS.map((c) => buildRawCollection(c.handle)!.image!.url),
  HERO_PHOTO.src,
  ...ARTICLES.map((a) => a.cover.src),
];

describe('local images', () => {
  it('every image slot points to a file under /public/images', () => {
    expect(localImages.length).toBeGreaterThan(90);
    expect(localImages.filter((src) => !src.startsWith('/images/'))).toEqual([]);
  });

  it('every referenced file exists', () => {
    expect(localImages.filter((src) => !existsSync(join(PUBLIC, src)))).toEqual([]);
  });

  it('every file is WebP', () => {
    expect(localImages.filter((src) => !src.endsWith('.webp') || !isWebp(src))).toEqual([]);
  });

  it('every product colour has its own photos and a variant image', () => {
    for (const spec of PRODUCT_SPECS) {
      const product = buildRawProduct(spec, 'USD');
      expect(product.featuredImage).not.toBeNull();
      expect(product.images.nodes).toHaveLength(spec.colors.length * 3);
      expect(product.variants.nodes.every((v) => v.image !== null)).toBe(true);
    }
  });

  it('every photo has alt text and a credit', () => {
    for (const photo of [HERO_PHOTO, ...ARTICLES.map((a) => a.cover)]) {
      expect(photo.alt.length).toBeGreaterThan(10);
      expect(photo.credit.url).toMatch(/^https:\/\/unsplash\.com\/photos\//);
      expect(photo.remote).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
    }
  });
});
