#!/usr/bin/env node
/**
 * Sends every GraphQL operation the storefront uses to the live Storefront API
 * (mock.shop by default) and reports which ones succeed.
 *
 *   npm run verify:live
 *   SHOPIFY_STOREFRONT_ENDPOINT=https://<store>.myshopify.com/api/2025-07/graphql.json \
 *   SHOPIFY_STOREFRONT_TOKEN=<token> npm run verify:live
 */
import * as q from '../src/lib/shopify/queries.ts';

const endpoint = process.env.SHOPIFY_STOREFRONT_ENDPOINT || 'https://mock.shop/api';
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
let failures = 0;

async function run(label, document, variables) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Shopify-Storefront-Access-Token': token } : {}),
      },
      body: JSON.stringify({ query: document, variables }),
    });
    const body = await res.json();
    if (!res.ok || body.errors?.length) {
      failures++;
      console.log(`✗ ${label}: ${res.status} ${JSON.stringify(body.errors ?? body).slice(0, 400)}`);
      return null;
    }
    console.log(`✓ ${label}`);
    return body.data;
  } catch (error) {
    failures++;
    console.log(`✗ ${label}: ${error.message}`);
    return null;
  }
}

console.log(`Checking ${endpoint}\n`);

const products = await run('GetProducts', q.GET_PRODUCTS, {
  first: 5,
  sortKey: 'BEST_SELLING',
  reverse: false,
  country: 'US',
});
const first = products?.products?.nodes?.[0];
if (first) {
  console.log(`  ${products.products.nodes.length} products, first: "${first.title}"`);
  const labels = (first.metafields ?? []).filter(Boolean).length;
  console.log(`  label metafields on first product: ${labels} (0 is expected on mock.shop)`);
}

await run('GetProducts (search)', q.GET_PRODUCTS, {
  first: 5,
  query: 'shirt',
  sortKey: 'RELEVANCE',
  reverse: false,
  country: 'US',
});
await run('GetProducts (GB prices)', q.GET_PRODUCTS, {
  first: 1,
  sortKey: 'CREATED_AT',
  reverse: true,
  country: 'GB',
});

const collections = await run('GetCollections', q.GET_COLLECTIONS, { first: 5, country: 'US' });
const collection = collections?.collections?.nodes?.[0];
if (collection) {
  await run(`GetCollectionProducts (${collection.handle})`, q.GET_COLLECTION_PRODUCTS, {
    handle: collection.handle,
    first: 10,
    sortKey: 'COLLECTION_DEFAULT',
    reverse: false,
    country: 'US',
  });
}

if (first) {
  await run(`GetProduct (${first.handle})`, q.GET_PRODUCT, { handle: first.handle, country: 'US' });
  await run('GetProductRecommendations', q.GET_PRODUCT_RECOMMENDATIONS, {
    productId: first.id,
    country: 'US',
  });

  const variant = first.variants.nodes.find((v) => v.availableForSale) ?? first.variants.nodes[0];
  const created = await run('CreateCart', q.CREATE_CART, {
    lines: [{ merchandiseId: variant.id, quantity: 1 }],
    country: 'US',
  });
  const cart = created?.cartCreate?.cart;
  if (created?.cartCreate?.userErrors?.length) console.log('  userErrors:', created.cartCreate.userErrors);
  if (cart) {
    console.log(`  cart ${cart.id.slice(0, 40)}…, checkoutUrl: ${cart.checkoutUrl.slice(0, 60)}`);
    await run('AddCartLines', q.ADD_CART_LINES, {
      cartId: cart.id,
      lines: [{ merchandiseId: variant.id, quantity: 1 }],
      country: 'US',
    });
    await run('GetCart', q.GET_CART, { cartId: cart.id, country: 'US' });
    const lineId = cart.lines.nodes[0]?.id;
    if (lineId) {
      await run('UpdateCartLines', q.UPDATE_CART_LINES, {
        cartId: cart.id,
        lines: [{ id: lineId, quantity: 3 }],
        country: 'US',
      });
      await run('RemoveCartLines', q.REMOVE_CART_LINES, {
        cartId: cart.id,
        lineIds: [lineId],
        country: 'US',
      });
    }
    await run('UpdateCartBuyerIdentity', q.UPDATE_CART_BUYER_IDENTITY, { cartId: cart.id, country: 'GB' });
  }
}

console.log(failures ? `\n${failures} operation(s) failed.` : '\nAll operations succeeded.');
process.exit(failures ? 1 : 0);
