import { beforeEach, describe, expect, it } from 'vitest';
import { handleFixtureOperation, resetFixtureCarts } from '@/lib/shopify/fixtures/handler';
import type { CartMutationPayload, RawProduct } from '@/lib/shopify/raw-types';

const HOODIE_OAT_L = 'gid://shopify/ProductVariant/heavyweight-hoodie--oat--l';
const HOODIE_OAT_XL = 'gid://shopify/ProductVariant/heavyweight-hoodie--oat--xl';

async function createCart(lines: { merchandiseId: string; quantity: number }[], country = 'US') {
  const data = (await handleFixtureOperation('CreateCart', { lines, country })) as {
    cartCreate: CartMutationPayload;
  };
  return data.cartCreate;
}

describe('fixture data source', () => {
  beforeEach(() => resetFixtureCarts());

  it('creates a cart and totals the lines', async () => {
    const { cart } = await createCart([{ merchandiseId: HOODIE_OAT_L, quantity: 2 }]);
    expect(cart?.totalQuantity).toBe(2);
    expect(cart?.cost.subtotalAmount).toEqual({ amount: '196.00', currencyCode: 'USD' });
  });

  it('refuses sold-out variants with a user error', async () => {
    const payload = await createCart([{ merchandiseId: HOODIE_OAT_XL, quantity: 1 }]);
    expect(payload.cart).toBeNull();
    expect(payload.userErrors[0]?.message).toMatch(/sold out/);
  });

  it('merges repeated adds, updates and removes lines', async () => {
    const { cart } = await createCart([{ merchandiseId: HOODIE_OAT_L, quantity: 1 }]);
    const cartId = cart!.id;
    const added = (await handleFixtureOperation('AddCartLines', {
      cartId,
      lines: [{ merchandiseId: HOODIE_OAT_L, quantity: 1 }],
    })) as { cartLinesAdd: CartMutationPayload };
    expect(added.cartLinesAdd.cart?.lines.nodes).toHaveLength(1);
    expect(added.cartLinesAdd.cart?.totalQuantity).toBe(2);

    const lineId = added.cartLinesAdd.cart!.lines.nodes[0]!.id;
    const removed = (await handleFixtureOperation('RemoveCartLines', { cartId, lineIds: [lineId] })) as {
      cartLinesRemove: CartMutationPayload;
    };
    expect(removed.cartLinesRemove.cart?.totalQuantity).toBe(0);
  });

  it('reprices the cart when the market changes', async () => {
    const { cart } = await createCart([{ merchandiseId: HOODIE_OAT_L, quantity: 1 }]);
    const moved = (await handleFixtureOperation('UpdateCartBuyerIdentity', {
      cartId: cart!.id,
      country: 'GB',
    })) as {
      cartBuyerIdentityUpdate: CartMutationPayload;
    };
    expect(moved.cartBuyerIdentityUpdate.cart?.cost.totalAmount.currencyCode).toBe('GBP');
  });

  it('searches the catalog by keyword', async () => {
    const data = (await handleFixtureOperation('GetProducts', { first: 10, query: 'jacket' })) as {
      products: { nodes: RawProduct[] };
    };
    expect(data.products.nodes.map((p) => p.handle).sort()).toEqual([
      'canvas-chore-jacket',
      'quilted-liner-jacket',
    ]);
  });
});
