/**
 * GA4 ecommerce events via window.dataLayer. Nothing is pushed until the visitor accepts
 * analytics, and the GA script itself only loads after consent (see components/consent).
 */
import type { Money } from './shopify/types';

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price: number;
  quantity?: number;
};

export type AnalyticsEvent =
  | { name: 'view_item'; currency: string; value: number; items: AnalyticsItem[] }
  | { name: 'view_item_list'; item_list_name: string; items: AnalyticsItem[] }
  | { name: 'add_to_cart'; currency: string; value: number; items: AnalyticsItem[] }
  | { name: 'remove_from_cart'; currency: string; value: number; items: AnalyticsItem[] }
  | { name: 'add_to_wishlist'; currency: string; value: number; items: AnalyticsItem[] }
  | { name: 'begin_checkout'; currency: string; value: number; items: AnalyticsItem[] }
  | { name: 'search'; search_term: string };

export const CONSENT_KEY = 'nf_consent';
export type Consent = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function track(event: AnalyticsEvent): boolean {
  if (typeof window === 'undefined' || readConsent() !== 'granted') return false;
  const { name, ...params } = event;
  window.dataLayer = window.dataLayer ?? [];
  // GA4 recommends clearing the previous ecommerce object before pushing a new one.
  if ('items' in params) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event: name, ...('items' in params ? { ecommerce: params } : params) });
  return true;
}

export function toItem(input: {
  id: string;
  title: string;
  variant?: string;
  category?: string;
  price: Money;
  quantity?: number;
}): AnalyticsItem {
  return {
    item_id: input.id,
    item_name: input.title,
    item_variant: input.variant,
    item_category: input.category,
    price: Number(input.price.amount),
    quantity: input.quantity ?? 1,
  };
}
