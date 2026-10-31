'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { COUNTRY_COOKIE, isCountryCode } from '@/lib/markets';
import { CART_COOKIE, isMarketsEnabled, updateCartCountry } from '@/lib/shopify';

export async function setCountry(country: string): Promise<{ ok: boolean }> {
  if (!isMarketsEnabled() || !isCountryCode(country)) return { ok: false };
  const jar = await cookies();
  jar.set(COUNTRY_COOKIE, country, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });

  // Keep an existing cart's prices and checkout in the new market.
  const cartId = jar.get(CART_COOKIE)?.value;
  if (cartId) {
    try {
      await updateCartCountry(cartId, country);
    } catch (error) {
      console.error(error);
    }
  }
  revalidatePath('/', 'layout');
  return { ok: true };
}
