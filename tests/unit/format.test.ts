import { describe, expect, it } from 'vitest';
import { formatDate, formatMoney, formatPriceRange, money } from '@/lib/format';
import { getMarket, isCountryCode } from '@/lib/markets';

describe('formatMoney', () => {
  it('drops decimals for whole amounts', () => {
    expect(formatMoney({ amount: '98.00', currencyCode: 'USD' })).toBe('$98');
  });

  it('keeps cents when present', () => {
    expect(formatMoney({ amount: '12.5', currencyCode: 'USD' })).toBe('$12.50');
  });

  it('formats zero-decimal currencies and other locales', () => {
    expect(formatMoney({ amount: '14700', currencyCode: 'JPY' }, 'ja-JP')).toBe('￥14,700');
    expect(formatMoney({ amount: '90.00', currencyCode: 'EUR' }, 'de-DE')).toBe('90\u00a0€');
  });
});

describe('formatPriceRange', () => {
  it('shows a single price or a from-price', () => {
    const a = money(42, 'USD');
    expect(formatPriceRange(a, a)).toBe('$42');
    expect(formatPriceRange(a, money(54, 'USD'))).toBe('From $42');
  });
});

describe('formatDate', () => {
  it('formats ISO dates in UTC', () => {
    expect(formatDate('2026-10-12')).toBe('12 October 2026');
  });
});

describe('markets', () => {
  it('validates country codes and falls back to the default market', () => {
    expect(isCountryCode('GB')).toBe(true);
    expect(isCountryCode('FR')).toBe(false);
    expect(getMarket('XX').country).toBe('US');
    expect(getMarket('JP').currency).toBe('JPY');
  });
});
