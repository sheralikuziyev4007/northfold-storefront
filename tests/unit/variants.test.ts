import { describe, expect, it } from 'vitest';
import {
  defaultSelection,
  findVariant,
  imagesForColor,
  isValueAvailable,
  missingOptions,
  selectionFromParams,
} from '@/lib/catalog/variants';
import { fixtureProduct } from './helpers';

const hoodie = fixtureProduct('heavyweight-hoodie');
const tote = fixtureProduct('canvas-tote');
const beanie = fixtureProduct('ribbed-beanie');

describe('variant selection', () => {
  it('reads only valid option values from the URL', () => {
    expect(selectionFromParams(hoodie, { color: 'Oat', size: 'XXXL' })).toEqual({ Color: 'Oat' });
  });

  it('preselects the colour but leaves size to the shopper', () => {
    const selection = defaultSelection(hoodie, {});
    expect(selection).toEqual({ Color: 'Loden' });
    expect(missingOptions(hoodie, selection)).toEqual(['Size']);
    expect(findVariant(hoodie, selection)).toBeUndefined();
  });

  it('finds the variant once every option is chosen', () => {
    const variant = findVariant(hoodie, { Color: 'Oat', Size: 'L' });
    expect(variant?.title).toBe('Oat / L');
    expect(variant?.availableForSale).toBe(true);
  });

  it('treats products without options as a single variant', () => {
    expect(tote.options).toEqual([]);
    expect(findVariant(tote, defaultSelection(tote, {}))?.id).toBe(tote.variants[0]?.id);
  });

  it('selects the only value of single-value options', () => {
    expect(defaultSelection(beanie, {})).toEqual({ Color: 'Loden' });
    expect(findVariant(beanie, { Color: 'Oat' })?.title).toBe('Oat');
  });

  it('marks sold-out sizes as unavailable', () => {
    expect(isValueAvailable(hoodie, { Color: 'Loden' }, 'Size', 'XL')).toBe(false);
    expect(isValueAvailable(hoodie, { Color: 'Loden' }, 'Size', 'L')).toBe(true);
  });
});

describe('imagesForColor', () => {
  it('returns only the selected colour’s photos', () => {
    const images = imagesForColor(hoodie, 'Charcoal');
    expect(images).toHaveLength(3);
    expect(images.every((img) => /\/charcoal-\d\.webp$/.test(img.url))).toBe(true);
  });

  it('falls back to every photo when the colour is unknown', () => {
    expect(imagesForColor(hoodie, undefined)).toHaveLength(hoodie.images.length);
  });
});
