import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/actions/cart', () => ({ addItem: vi.fn(), removeItem: vi.fn(), updateItemQuantity: vi.fn() }));

const { cartReducer } = await import('@/components/cart/cart-context');
import type { Cart } from '@/lib/shopify/types';

const empty: Cart = {
  id: 'c1',
  checkoutUrl: '/checkout',
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: '0', currencyCode: 'USD' },
    totalAmount: { amount: '0', currencyCode: 'USD' },
  },
};

const input = {
  variantId: 'v1',
  variantTitle: 'Oat / L',
  selectedOptions: [],
  price: { amount: '98.00', currencyCode: 'USD' },
  product: { handle: 'heavyweight-hoodie', title: 'Heavyweight hoodie', featuredImage: null },
};

describe('cartReducer (optimistic updates)', () => {
  it('adds a new line immediately', () => {
    const cart = cartReducer(empty, { type: 'add', input });
    expect(cart.totalQuantity).toBe(1);
    expect(cart.lines[0]?.id).toBe('optimistic-v1');
    expect(cart.cost.subtotalAmount.amount).toBe('98.00');
  });

  it('increments an existing line instead of duplicating it', () => {
    const once = cartReducer(empty, { type: 'add', input });
    const twice = cartReducer(once, { type: 'add', input });
    expect(twice.lines).toHaveLength(1);
    expect(twice.totalQuantity).toBe(2);
    expect(twice.cost.subtotalAmount.amount).toBe('196.00');
  });

  it('removes a line when its quantity drops to zero', () => {
    const cart = cartReducer(empty, { type: 'add', input });
    const cleared = cartReducer(cart, { type: 'quantity', lineId: 'optimistic-v1', quantity: 0 });
    expect(cleared.lines).toEqual([]);
    expect(cleared.totalQuantity).toBe(0);
  });
});
