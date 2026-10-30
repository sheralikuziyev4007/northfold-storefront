import { buildRawProduct, PRODUCT_SPECS } from '@/lib/shopify/fixtures/catalog';
import { normalizeProduct } from '@/lib/shopify/normalize';
import type { Product } from '@/lib/shopify/types';

export function fixtureProduct(handle: string, currency = 'USD'): Product {
  const spec = PRODUCT_SPECS.find((s) => s.handle === handle);
  if (!spec) throw new Error(`No fixture product ${handle}`);
  return normalizeProduct(buildRawProduct(spec, currency));
}

export function allFixtureProducts(currency = 'USD'): Product[] {
  return PRODUCT_SPECS.map((s) => normalizeProduct(buildRawProduct(s, currency)));
}
