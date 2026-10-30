'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import {
  addCartLines,
  CART_COOKIE,
  CartUserError,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from '@/lib/shopify';

export type CartActionResult = { ok: true } | { ok: false; error: string };

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

function failure(error: unknown, fallback: string): CartActionResult {
  if (error instanceof CartUserError) return { ok: false, error: error.message };
  console.error(error);
  return { ok: false, error: fallback };
}

export async function addItem(variantId: string, quantity = 1): Promise<CartActionResult> {
  if (!variantId) return { ok: false, error: 'Choose a size first.' };
  const lines = [{ merchandiseId: variantId, quantity }];
  try {
    const existing = await getCart();
    if (existing) {
      await addCartLines(existing.id, lines);
    } else {
      const cart = await createCart(lines);
      (await cookies()).set(CART_COOKIE, cart.id, COOKIE_OPTIONS);
    }
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    return failure(error, 'Couldn’t add this item to your cart. Your other items are unchanged.');
  }
}

export async function updateItemQuantity(lineId: string, quantity: number): Promise<CartActionResult> {
  try {
    const cart = await getCart();
    if (!cart) return { ok: false, error: 'Your cart has expired. Add the item again.' };
    if (quantity <= 0) await removeCartLines(cart.id, [lineId]);
    else await updateCartLines(cart.id, [{ id: lineId, quantity: Math.min(quantity, 99) }]);
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    return failure(error, 'Couldn’t update the quantity. Try again.');
  }
}

export async function removeItem(lineId: string): Promise<CartActionResult> {
  return updateItemQuantity(lineId, 0);
}
