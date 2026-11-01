import { describe, expect, it } from 'vitest';
import { pickCardColors } from '@/lib/catalog/card-colors';
import { allFixtureProducts, fixtureProduct } from './helpers';

const products = allFixtureProducts();

describe('pickCardColors', () => {
  it('never shows the same colour on two cards in a row', () => {
    const colors = pickCardColors(products).map((c) => c?.value ?? null);
    colors.forEach((value, i) => {
      if (value && i > 0) expect(value).not.toBe(colors[i - 1]);
    });
  });

  it('spreads cards across several colours', () => {
    const colors = pickCardColors(products).flatMap((c) => (c ? [c.value] : []));
    expect(new Set(colors).size).toBeGreaterThanOrEqual(4);
  });

  it('shows a colour picked in the filters when the product has it', () => {
    const hoodie = fixtureProduct('heavyweight-hoodie');
    const colour = hoodie.options.find((o) => /colou?r/i.test(o.name))!.values.at(-1)!;
    const [picked] = pickCardColors([hoodie], [colour]);
    expect(picked?.value).toBe(colour);
    expect(picked?.image?.url).toBeTruthy();
  });

  it('only picks colours that are in stock and returns the photo of that colour', () => {
    for (const [i, card] of pickCardColors(products).entries()) {
      if (!card) continue;
      const product = products[i]!;
      const variants = product.variants.filter((v) => v.selectedOptions.some((o) => o.value === card.value));
      expect(variants.some((v) => v.availableForSale)).toBe(true);
      expect(variants.map((v) => v.image?.url)).toContain(card.image?.url);
    }
  });
});
