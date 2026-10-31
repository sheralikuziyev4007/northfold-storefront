import 'server-only';
import { operationName } from './queries';
import { handleFixtureOperation } from './fixtures/handler';

export const TAGS = {
  products: 'products',
  collections: 'collections',
  cart: 'cart',
} as const;

const MOCK_SHOP_ENDPOINT = 'https://mock.shop/api';

export type DataSource = 'live' | 'fixtures';

export function getDataSource(): DataSource {
  return process.env.SHOPIFY_DATA_SOURCE === 'fixtures' ? 'fixtures' : 'live';
}

function storefrontEndpoint(): string {
  return process.env.SHOPIFY_STOREFRONT_ENDPOINT || MOCK_SHOP_ENDPOINT;
}

/**
 * mock.shop serves one market (USD) and ignores the products `query` argument,
 * so country switching and server-side search only run against the sample catalog or a real store.
 */
export function usesMockShop(): boolean {
  return getDataSource() === 'live' && storefrontEndpoint() === MOCK_SHOP_ENDPOINT;
}

/** The country selector is shown only in sample-catalog mode, where every market has its own prices. */
export function isMarketsEnabled(): boolean {
  return getDataSource() === 'fixtures';
}

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly operation: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}

type FetchOptions = {
  variables?: Record<string, unknown>;
  /** Cache tags for on-demand revalidation. Omit together with `cache: 'no-store'` for carts. */
  tags?: string[];
  cache?: RequestCache;
  revalidate?: number;
};

/**
 * Single entry point for Storefront API requests.
 * Catalog reads go through Next's Data Cache with tags; cart requests skip the cache.
 */
export async function storefrontFetch<T>(document: string, options: FetchOptions = {}): Promise<T> {
  const operation = operationName(document);
  const variables = options.variables ?? {};

  if (getDataSource() === 'fixtures') {
    return handleFixtureOperation(operation, variables) as Promise<T>;
  }

  const endpoint = storefrontEndpoint();
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Shopify-Storefront-Access-Token': token } : {}),
      },
      body: JSON.stringify({ query: document, variables }),
      ...(options.cache ? { cache: options.cache } : {}),
      next:
        options.cache === 'no-store'
          ? undefined
          : { tags: options.tags, revalidate: options.revalidate ?? 3600 },
    });
  } catch (error) {
    throw new ShopifyError(`Could not reach the store (${(error as Error).message})`, operation);
  }

  if (!response.ok) {
    throw new ShopifyError(`Store responded with ${response.status}`, operation, response.status);
  }

  const body = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) {
    throw new ShopifyError(body.errors.map((e) => e.message).join('; '), operation);
  }
  if (!body.data) throw new ShopifyError('Empty response', operation);
  return body.data;
}
