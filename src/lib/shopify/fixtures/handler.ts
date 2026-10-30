/**
 * Answers Storefront API operations from the sample catalog. Carts live in memory for the
 * lifetime of the server process, which is enough for local development, tests and CI.
 */
import type { CartMutationPayload, RawCart, RawProduct } from '../raw-types';
import { buildRawCollection, buildRawProduct, COLLECTION_SPECS, PRODUCT_SPECS, priceIn } from './catalog';
import { getMarket } from '@/lib/markets';

type Vars = Record<string, unknown>;
type StoredCart = {
  id: string;
  country: string;
  lines: { id: string; variantId: string; quantity: number }[];
};

const globalStore = globalThis as unknown as { __nfCarts?: Map<string, StoredCart>; __nfLineSeq?: number };
const carts = (globalStore.__nfCarts ??= new Map<string, StoredCart>());

function currencyFor(vars: Vars) {
  return getMarket(typeof vars.country === 'string' ? vars.country : null).currency;
}

function allProducts(vars: Vars): RawProduct[] {
  const currency = currencyFor(vars);
  return PRODUCT_SPECS.map((spec) => buildRawProduct(spec, currency));
}

function matchesQuery(product: RawProduct, query: string) {
  const haystack = [
    product.title,
    product.productType,
    ...product.tags,
    ...product.options.flatMap((o) => o.optionValues.map((v) => v.name)),
  ]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .replace(/[*:"()]/g, ' ')
    .split(/\s+/)
    .filter((term) => term && !['title', 'tag', 'product_type'].includes(term))
    .every((term) => haystack.includes(term));
}

function sortProducts(products: RawProduct[], sortKey: unknown, reverse: unknown) {
  const sorted = [...products];
  if (sortKey === 'CREATED_AT' || sortKey === 'CREATED') {
    sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } else if (sortKey === 'PRICE') {
    sorted.sort(
      (a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount),
    );
  } else if (sortKey === 'TITLE') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return reverse ? sorted.reverse() : sorted;
}

function findVariant(variantId: string, country: string) {
  for (const product of allProducts({ country })) {
    const variant = product.variants.nodes.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function nextLineId() {
  globalStore.__nfLineSeq = (globalStore.__nfLineSeq ?? 0) + 1;
  return `gid://shopify/CartLine/${globalStore.__nfLineSeq}`;
}

function toRawCart(stored: StoredCart): RawCart {
  const currency = getMarket(stored.country).currency;
  const nodes = stored.lines.flatMap((line) => {
    const found = findVariant(line.variantId, stored.country);
    if (!found) return [];
    const unit = Number(found.variant.price.amount);
    return [
      {
        id: line.id,
        quantity: line.quantity,
        cost: {
          amountPerQuantity: found.variant.price,
          totalAmount: {
            amount: (unit * line.quantity).toFixed(currency === 'JPY' ? 0 : 2),
            currencyCode: currency,
          },
        },
        merchandise: {
          id: found.variant.id,
          title: found.variant.title,
          selectedOptions: found.variant.selectedOptions,
          product: {
            handle: found.product.handle,
            title: found.product.title,
            featuredImage: found.variant.image ?? found.product.featuredImage,
          },
        },
      },
    ];
  });
  const subtotal = nodes.reduce((sum, l) => sum + Number(l.cost.totalAmount.amount), 0);
  const total = { amount: subtotal.toFixed(currency === 'JPY' ? 0 : 2), currencyCode: currency };
  return {
    id: stored.id,
    checkoutUrl: '/checkout',
    totalQuantity: nodes.reduce((sum, l) => sum + l.quantity, 0),
    cost: { subtotalAmount: total, totalAmount: total },
    lines: { nodes },
  };
}

function cartPayload(stored: StoredCart | undefined, message = 'Cart not found'): CartMutationPayload {
  return stored
    ? { cart: toRawCart(stored), userErrors: [] }
    : { cart: null, userErrors: [{ field: null, message }] };
}

function addLines(stored: StoredCart, lines: { merchandiseId: string; quantity?: number }[]): string | null {
  for (const line of lines) {
    const found = findVariant(line.merchandiseId, stored.country);
    if (!found) return 'The selected item no longer exists.';
    if (!found.variant.availableForSale)
      return `${found.product.title} (${found.variant.title}) is sold out.`;
    const existing = stored.lines.find((l) => l.variantId === line.merchandiseId);
    if (existing) existing.quantity += line.quantity ?? 1;
    else stored.lines.push({ id: nextLineId(), variantId: line.merchandiseId, quantity: line.quantity ?? 1 });
  }
  return null;
}

export async function handleFixtureOperation(operation: string, vars: Vars): Promise<unknown> {
  switch (operation) {
    case 'GetProducts': {
      const query = typeof vars.query === 'string' ? vars.query : '';
      const filtered = allProducts(vars).filter((p) => !query || matchesQuery(p, query));
      return {
        products: { nodes: sortProducts(filtered, vars.sortKey, vars.reverse).slice(0, Number(vars.first)) },
      };
    }
    case 'GetProduct':
      return { product: allProducts(vars).find((p) => p.handle === vars.handle) ?? null };
    case 'GetProductRecommendations': {
      const products = allProducts(vars);
      const source = PRODUCT_SPECS.find((s) => `gid://shopify/Product/${s.handle}` === vars.productId);
      if (!source) return { productRecommendations: null };
      const sameCollection = PRODUCT_SPECS.filter((s) => s.collection === source.collection && s !== source);
      const others = PRODUCT_SPECS.filter((s) => s.collection !== source.collection);
      const handles = [...sameCollection, ...others].slice(0, 4).map((s) => s.handle);
      return { productRecommendations: handles.map((h) => products.find((p) => p.handle === h)!) };
    }
    case 'GetCollections':
      return { collections: { nodes: COLLECTION_SPECS.map((c) => buildRawCollection(c.handle)!) } };
    case 'GetCollectionProducts': {
      const handle = String(vars.handle);
      const collection = buildRawCollection(handle);
      if (!collection) return { collection: null };
      const handles = new Set(PRODUCT_SPECS.filter((s) => s.collection === handle).map((s) => s.handle));
      const products = allProducts(vars).filter((p) => handles.has(p.handle));
      return {
        collection: {
          ...collection,
          products: {
            nodes: sortProducts(products, vars.sortKey, vars.reverse).slice(0, Number(vars.first)),
          },
        },
      };
    }
    case 'GetCart': {
      const stored = carts.get(String(vars.cartId));
      if (stored && typeof vars.country === 'string') stored.country = vars.country;
      return { cart: stored ? toRawCart(stored) : null };
    }
    case 'CreateCart': {
      const stored: StoredCart = {
        id: `gid://shopify/Cart/fixture-${crypto.randomUUID()}`,
        country: typeof vars.country === 'string' ? vars.country : 'US',
        lines: [],
      };
      const error = addLines(stored, (vars.lines as { merchandiseId: string; quantity?: number }[]) ?? []);
      if (error) return { cartCreate: cartPayload(undefined, error) };
      carts.set(stored.id, stored);
      return { cartCreate: cartPayload(stored) };
    }
    case 'AddCartLines': {
      const stored = carts.get(String(vars.cartId));
      if (!stored) return { cartLinesAdd: cartPayload(undefined) };
      const error = addLines(stored, vars.lines as { merchandiseId: string; quantity?: number }[]);
      return { cartLinesAdd: error ? cartPayload(undefined, error) : cartPayload(stored) };
    }
    case 'UpdateCartLines': {
      const stored = carts.get(String(vars.cartId));
      if (!stored) return { cartLinesUpdate: cartPayload(undefined) };
      for (const update of vars.lines as { id: string; quantity: number }[]) {
        const line = stored.lines.find((l) => l.id === update.id);
        if (line) line.quantity = update.quantity;
      }
      stored.lines = stored.lines.filter((l) => l.quantity > 0);
      return { cartLinesUpdate: cartPayload(stored) };
    }
    case 'RemoveCartLines': {
      const stored = carts.get(String(vars.cartId));
      if (!stored) return { cartLinesRemove: cartPayload(undefined) };
      const ids = new Set(vars.lineIds as string[]);
      stored.lines = stored.lines.filter((l) => !ids.has(l.id));
      return { cartLinesRemove: cartPayload(stored) };
    }
    case 'UpdateCartBuyerIdentity': {
      const stored = carts.get(String(vars.cartId));
      if (!stored) return { cartBuyerIdentityUpdate: cartPayload(undefined) };
      stored.country = String(vars.country);
      return { cartBuyerIdentityUpdate: cartPayload(stored) };
    }
    default:
      throw new Error(`Fixture data source has no handler for ${operation}`);
  }
}

/** Exposed for tests. */
export function resetFixtureCarts() {
  carts.clear();
}

export { priceIn };
