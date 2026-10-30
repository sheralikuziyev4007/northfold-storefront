import type { Money } from './shopify/types';

const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'CLP', 'ISK', 'UGX']);

/** Formats a Storefront API money value. Whole amounts drop the decimals ($98, not $98.00). */
export function formatMoney(money: Money, locale = 'en-US'): string {
  const amount = Number(money.amount);
  const whole = Number.isInteger(amount) || ZERO_DECIMAL.has(money.currencyCode);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currencyCode,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: ZERO_DECIMAL.has(money.currencyCode) ? 0 : 2,
  }).format(amount);
}

export function formatPriceRange(min: Money, max: Money, locale?: string): string {
  if (Number(min.amount) === Number(max.amount)) return formatMoney(min, locale);
  return `From ${formatMoney(min, locale)}`;
}

export function formatDate(iso: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export function money(amount: number, currencyCode: string): Money {
  return { amount: ZERO_DECIMAL.has(currencyCode) ? amount.toFixed(0) : amount.toFixed(2), currencyCode };
}
