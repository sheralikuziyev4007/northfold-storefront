'use client';

import {
  createContext,
  use,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useTransition,
  type ReactNode,
} from 'react';
import { addItem, removeItem, updateItemQuantity, type CartActionResult } from '@/app/actions/cart';
import type { Cart, CartLine, Image, Money, SelectedOption } from '@/lib/shopify/types';

export type AddInput = {
  variantId: string;
  variantTitle: string;
  selectedOptions: SelectedOption[];
  price: Money;
  product: { handle: string; title: string; featuredImage: Image | null };
};

type Action = { type: 'add'; input: AddInput } | { type: 'quantity'; lineId: string; quantity: number };

const EMPTY: Cart = {
  id: '',
  checkoutUrl: '',
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: '0', currencyCode: 'USD' },
    totalAmount: { amount: '0', currencyCode: 'USD' },
  },
};

function lineTotal(unit: Money, quantity: number): Money {
  return { amount: (Number(unit.amount) * quantity).toFixed(2), currencyCode: unit.currencyCode };
}

function recalc(cart: Cart, lines: CartLine[]): Cart {
  const currency = lines[0]?.cost.amountPerQuantity.currencyCode ?? cart.cost.totalAmount.currencyCode;
  const subtotal = lines.reduce((sum, l) => sum + Number(l.cost.totalAmount.amount), 0).toFixed(2);
  return {
    ...cart,
    lines,
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    cost: {
      subtotalAmount: { amount: subtotal, currencyCode: currency },
      totalAmount: { amount: subtotal, currencyCode: currency },
    },
  };
}

/** Applies a change locally so the UI responds before the Storefront API does. */
export function cartReducer(cart: Cart, action: Action): Cart {
  if (action.type === 'add') {
    const { input } = action;
    const existing = cart.lines.find((l) => l.merchandise.id === input.variantId);
    const lines = existing
      ? cart.lines.map((l) =>
          l === existing
            ? {
                ...l,
                quantity: l.quantity + 1,
                cost: { ...l.cost, totalAmount: lineTotal(input.price, l.quantity + 1) },
              }
            : l,
        )
      : [
          ...cart.lines,
          {
            id: `optimistic-${input.variantId}`,
            quantity: 1,
            cost: { amountPerQuantity: input.price, totalAmount: input.price },
            merchandise: {
              id: input.variantId,
              title: input.variantTitle,
              selectedOptions: input.selectedOptions,
              product: input.product,
            },
          },
        ];
    return recalc(cart, lines);
  }
  const lines = cart.lines
    .map((l) =>
      l.id === action.lineId
        ? {
            ...l,
            quantity: action.quantity,
            cost: { ...l.cost, totalAmount: lineTotal(l.cost.amountPerQuantity, action.quantity) },
          }
        : l,
    )
    .filter((l) => l.quantity > 0);
  return recalc(cart, lines);
}

type CartContextValue = {
  cart: Cart;
  pending: boolean;
  addToCart: (input: AddInput) => Promise<CartActionResult>;
  setQuantity: (lineId: string, quantity: number) => Promise<CartActionResult>;
  removeLine: (lineId: string) => Promise<CartActionResult>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  cartPromise,
  children,
}: {
  cartPromise: Promise<Cart | null>;
  children: ReactNode;
}) {
  const initial = use(cartPromise) ?? EMPTY;
  const [cart, apply] = useOptimistic(initial, cartReducer);
  const [pending, startTransition] = useTransition();

  const run = useCallback(
    (action: Action, request: () => Promise<CartActionResult>) =>
      new Promise<CartActionResult>((resolve) => {
        startTransition(async () => {
          apply(action);
          resolve(await request());
        });
      }),
    [apply],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      pending,
      addToCart: (input) => run({ type: 'add', input }, () => addItem(input.variantId)),
      setQuantity: (lineId, quantity) =>
        run({ type: 'quantity', lineId, quantity }, () => updateItemQuantity(lineId, quantity)),
      removeLine: (lineId) => run({ type: 'quantity', lineId, quantity: 0 }, () => removeItem(lineId)),
    }),
    [cart, pending, run],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
