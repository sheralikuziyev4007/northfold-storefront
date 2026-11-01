import type { Image, Product } from '@/lib/shopify/types';

export type CardColor = {
  /** Option name as the product page reads it from the URL, e.g. "color". */
  param: string;
  value: string;
  image: Image | null;
};

const isColorOption = (name: string) => /^colou?r$/i.test(name);

/** Image of the first variant in this colour, preferring one that is in stock. */
function imageFor(product: Product, option: string, value: string): Image | null {
  const variants = product.variants.filter((v) =>
    v.selectedOptions.some((o) => o.name === option && o.value === value),
  );
  return (
    (variants.find((v) => v.availableForSale && v.image) ?? variants.find((v) => v.image))?.image ?? null
  );
}

/**
 * Chooses the colour each card shows, so a grid does not open on the same colour for every product.
 * Colours picked in the filters win. Otherwise each card takes the in-stock colour used least so far
 * in the grid, never the same as the card before it.
 */
export function pickCardColors(products: Product[], preferred: string[] = []): (CardColor | null)[] {
  const used = new Map<string, number>();
  let previous: string | null = null;

  return products.map((product, index) => {
    const option = product.options.find((o) => isColorOption(o.name));
    if (!option || option.values.length < 2) {
      previous = null;
      return null;
    }

    const inStock = option.values.filter((value) =>
      product.variants.some(
        (v) =>
          v.availableForSale && v.selectedOptions.some((o) => o.name === option.name && o.value === value),
      ),
    );
    const candidates = inStock.length ? inStock : option.values;
    const wanted = candidates.filter((value) => preferred.includes(value));

    let value: string;
    if (wanted.length) {
      value = wanted[0]!;
    } else {
      // Rotate the starting point by position so ties do not always fall to the first colour.
      const rotated = candidates.map((_, i) => candidates[(i + index) % candidates.length]!);
      const score = (v: string) => (used.get(v) ?? 0) * 2 + (v === previous ? 3 : 0);
      value = rotated.reduce((best, v) => (score(v) < score(best) ? v : best));
    }

    used.set(value, (used.get(value) ?? 0) + 1);
    previous = value;
    return { param: option.name.toLowerCase(), value, image: imageFor(product, option.name, value) };
  });
}
