/* Variant selection helpers shared by the product page and its tests. */
import type { Product, ProductVariant } from '@/lib/shopify/types';

export type Selection = Record<string, string>;

/** Reads option selections from search params, keeping only values the product has. */
export function selectionFromParams(
  product: Product,
  params: Record<string, string | string[] | undefined>,
): Selection {
  const selection: Selection = {};
  for (const option of product.options) {
    const raw = params[option.name.toLowerCase()];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value && option.values.includes(value)) selection[option.name] = value;
  }
  return selection;
}

/** Products with one value per option (or no options) are preselected. Colour defaults to the first available. */
export function defaultSelection(product: Product, current: Selection): Selection {
  const selection = { ...current };
  for (const option of product.options) {
    if (selection[option.name]) continue;
    if (option.values.length === 1) {
      selection[option.name] = option.values[0]!;
    } else if (/^colou?r$/i.test(option.name)) {
      const firstAvailable = product.variants
        .find((v) => v.availableForSale)
        ?.selectedOptions.find((o) => o.name === option.name);
      selection[option.name] = firstAvailable?.value ?? option.values[0]!;
    }
  }
  return selection;
}

export function findVariant(product: Product, selection: Selection): ProductVariant | undefined {
  if (!product.options.length) return product.variants[0];
  if (product.options.some((o) => !selection[o.name])) return undefined;
  return product.variants.find((v) => v.selectedOptions.every((o) => selection[o.name] === o.value));
}

/** True when choosing `value` for `optionName`, keeping the other selections, leads to a variant in stock. */
export function isValueAvailable(
  product: Product,
  selection: Selection,
  optionName: string,
  value: string,
): boolean {
  return product.variants.some(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.every((o) =>
        o.name === optionName ? o.value === value : !selection[o.name] || selection[o.name] === o.value,
      ),
  );
}

/**
 * Shopify stores product images in one flat list. When each colour's variant points at its own
 * first image, the images between two such anchors belong to that colour. Falls back to every
 * image when the store does not follow that pattern.
 */
export function imagesForColor(product: Product, color: string | undefined): Product['images'] {
  const option = product.options.find((o) => /^colou?r$/i.test(o.name));
  if (!option || !color || option.values.length < 2) return product.images;
  const urls = product.images.map((i) => i.url);
  const anchors = option.values.map((value) => {
    const url = product.variants.find((v) =>
      v.selectedOptions.some((o) => o.name === option.name && o.value === value),
    )?.image?.url;
    return url ? urls.indexOf(url) : -1;
  });
  if (anchors.includes(-1) || new Set(anchors).size !== anchors.length) return product.images;
  const start = anchors[option.values.indexOf(color)];
  if (start === undefined || start < 0) return product.images;
  const end = Math.min(...anchors.filter((a) => a > start), product.images.length);
  return product.images.slice(start, end);
}

export function missingOptions(product: Product, selection: Selection): string[] {
  return product.options.filter((o) => !selection[o.name]).map((o) => o.name);
}
