import { beforeEach, describe, expect, it } from 'vitest';
import { CONSENT_KEY, track } from '@/lib/analytics';

const event = { name: 'search' as const, search_term: 'hoodie' };

describe('track', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it('does nothing before consent', () => {
    expect(track(event)).toBe(false);
    expect(window.dataLayer).toEqual([]);
  });

  it('does nothing after the visitor declines', () => {
    window.localStorage.setItem(CONSENT_KEY, 'denied');
    expect(track(event)).toBe(false);
  });

  it('pushes GA4 events after consent and clears the previous ecommerce object', () => {
    window.localStorage.setItem(CONSENT_KEY, 'granted');
    track({
      name: 'add_to_cart',
      currency: 'USD',
      value: 98,
      items: [{ item_id: 'v1', item_name: 'Heavyweight hoodie', price: 98, quantity: 1 }],
    });
    expect(window.dataLayer).toEqual([
      { ecommerce: null },
      {
        event: 'add_to_cart',
        ecommerce: {
          currency: 'USD',
          value: 98,
          items: [{ item_id: 'v1', item_name: 'Heavyweight hoodie', price: 98, quantity: 1 }],
        },
      },
    ]);
  });
});
