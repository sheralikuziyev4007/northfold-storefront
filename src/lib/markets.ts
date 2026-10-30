/**
 * Markets the storefront ships to. Shopify returns prices in the market's currency when a
 * request carries @inContext(country:). The free-shipping threshold is store policy per market,
 * not a currency conversion.
 */
export type Market = {
  country: CountryCode;
  name: string;
  currency: string;
  symbol: string;
  locale: string;
  freeShippingThreshold: number;
};

export const MARKETS = [
  {
    country: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    locale: 'en-US',
    freeShippingThreshold: 120,
  },
  {
    country: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    freeShippingThreshold: 100,
  },
  {
    country: 'DE',
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    freeShippingThreshold: 110,
  },
  {
    country: 'CA',
    name: 'Canada',
    currency: 'CAD',
    symbol: '$',
    locale: 'en-CA',
    freeShippingThreshold: 160,
  },
  {
    country: 'JP',
    name: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    locale: 'ja-JP',
    freeShippingThreshold: 18000,
  },
] as const satisfies readonly (Omit<Market, 'country'> & { country: string })[];

export type CountryCode = (typeof MARKETS)[number]['country'];

export const DEFAULT_COUNTRY: CountryCode = 'US';
export const COUNTRY_COOKIE = 'nf_country';

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === 'string' && MARKETS.some((m) => m.country === value);
}

export function getMarket(country: string | undefined | null): Market {
  return (MARKETS.find((m) => m.country === country) ?? MARKETS[0]) as Market;
}
