import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, isCountryCode, type CountryCode } from '@/lib/markets';
import { storefrontFetch, TAGS } from './client';
import { normalizeCart, normalizeCollection, normalizeProduct } from './normalize';
import {
  ADD_CART_LINES,
  CREATE_CART,
  GET_CART,
  GET_COLLECTION_PRODUCTS,
  GET_COLLECTIONS,
  GET_PRODUCT,
  GET_PRODUCT_RECOMMENDATIONS,
  GET_PRODUCTS,
  REMOVE_CART_LINES,
  UPDATE_CART_BUYER_IDENTITY,
  UPDATE_CART_LINES,
} from './queries';
import type { CartMutationPayload, RawCart, RawCollection, RawProduct } from './raw-types';
import type { Cart, Collection, Product } from './types';

export { ShopifyError, getDataSource, TAGS } from './client';
export * from './types';

export const ALL_PRODUCTS_HANDLE = 'all';
export const CART_COOKIE = 'nf_cart';

export const getCountry = cache(async (): Promise<CountryCode> => {
  const value = (await cookies()).get(COUNTRY_COOKIE)?.value;
  return isCountryCode(value) ? value : DEFAULT_COUNTRY;
});

/* ---------- Catalog ---------- */

export const getProducts = cache(
  async (options: { first?: number; query?: string; newestFirst?: boolean } = {}): Promise<Product[]> => {
    const data = await storefrontFetch<{ products: { nodes: RawProduct[] } }>(GET_PRODUCTS, {
      variables: {
        first: options.first ?? 100,
        query: options.query || null,
        sortKey: options.newestFirst ? 'CREATED_AT' : options.query ? 'RELEVANCE' : 'BEST_SELLING',
        reverse: Boolean(options.newestFirst),
        country: await getCountry(),
      },
      tags: [TAGS.products],
    });
    return data.products.nodes.map(normalizeProduct);
  },
);

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  const data = await storefrontFetch<{ product: RawProduct | null }>(GET_PRODUCT, {
    variables: { handle, country: await getCountry() },
    tags: [TAGS.products],
  });
  return data.product ? normalizeProduct(data.product) : null;
});

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const data = await storefrontFetch<{ productRecommendations: RawProduct[] | null }>(
    GET_PRODUCT_RECOMMENDATIONS,
    {
      variables: { productId, country: await getCountry() },
      tags: [TAGS.products],
    },
  );
  return (data.productRecommendations ?? []).slice(0, 4).map(normalizeProduct);
}

export const getCollections = cache(async (): Promise<Collection[]> => {
  const data = await storefrontFetch<{ collections: { nodes: RawCollection[] } }>(GET_COLLECTIONS, {
    variables: { first: 20, country: await getCountry() },
    tags: [TAGS.collections],
  });
  return data.collections.nodes.map(normalizeCollection);
});

/**
 * Products for a collection page. "all" is a virtual collection backed by the products query.
 * Returns null when the collection does not exist.
 */
export const getCollectionWithProducts = cache(
  async (handle: string): Promise<{ collection: Collection; products: Product[] } | null> => {
    if (handle === ALL_PRODUCTS_HANDLE) {
      const products = await getProducts({ newestFirst: true });
      return {
        collection: {
          id: 'all',
          handle: ALL_PRODUCTS_HANDLE,
          title: 'New in',
          description: 'Everything in the store, newest first.',
          image: null,
        },
        products,
      };
    }
    const data = await storefrontFetch<{
      collection: (RawCollection & { products: { nodes: RawProduct[] } }) | null;
    }>(GET_COLLECTION_PRODUCTS, {
      variables: {
        handle,
        first: 100,
        sortKey: 'COLLECTION_DEFAULT',
        reverse: false,
        country: await getCountry(),
      },
      tags: [TAGS.collections, TAGS.products],
    });
    if (!data.collection) return null;
    return {
      collection: normalizeCollection(data.collection),
      products: data.collection.products.nodes.map(normalizeProduct),
    };
  },
);

export async function searchProducts(query: string, first = 24): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return getProducts({ query: trimmed, first });
}

/* ---------- Cart ---------- */

async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

export const getCart = cache(async (): Promise<Cart | null> => {
  const cartId = await getCartId();
  if (!cartId) return null;
  const data = await storefrontFetch<{ cart: RawCart | null }>(GET_CART, {
    variables: { cartId, country: await getCountry() },
    cache: 'no-store',
  });
  return data.cart ? normalizeCart(data.cart) : null;
});

export class CartUserError extends Error {
  override name = 'CartUserError';
}

function unwrap(payload: CartMutationPayload): Cart {
  if (payload.userErrors.length || !payload.cart) {
    throw new CartUserError(payload.userErrors[0]?.message ?? 'The cart could not be updated.');
  }
  return normalizeCart(payload.cart);
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const data = await storefrontFetch<{ cartCreate: CartMutationPayload }>(CREATE_CART, {
    variables: { lines, country: await getCountry() },
    cache: 'no-store',
  });
  return unwrap(data.cartCreate);
}

export async function addCartLines(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const data = await storefrontFetch<{ cartLinesAdd: CartMutationPayload }>(ADD_CART_LINES, {
    variables: { cartId, lines, country: await getCountry() },
    cache: 'no-store',
  });
  return unwrap(data.cartLinesAdd);
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await storefrontFetch<{ cartLinesUpdate: CartMutationPayload }>(UPDATE_CART_LINES, {
    variables: { cartId, lines, country: await getCountry() },
    cache: 'no-store',
  });
  return unwrap(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await storefrontFetch<{ cartLinesRemove: CartMutationPayload }>(REMOVE_CART_LINES, {
    variables: { cartId, lineIds, country: await getCountry() },
    cache: 'no-store',
  });
  return unwrap(data.cartLinesRemove);
}

export async function updateCartCountry(cartId: string, country: CountryCode) {
  const data = await storefrontFetch<{ cartBuyerIdentityUpdate: CartMutationPayload }>(
    UPDATE_CART_BUYER_IDENTITY,
    {
      variables: { cartId, country },
      cache: 'no-store',
    },
  );
  return unwrap(data.cartBuyerIdentityUpdate);
}
