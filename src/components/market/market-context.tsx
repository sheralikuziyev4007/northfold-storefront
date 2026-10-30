'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { formatMoney } from '@/lib/format';
import type { Market } from '@/lib/markets';
import type { Money } from '@/lib/shopify/types';

const MarketContext = createContext<Market | null>(null);

export function MarketProvider({ market, children }: { market: Market; children: ReactNode }) {
  return <MarketContext value={market}>{children}</MarketContext>;
}

export function useMarket(): Market {
  const market = useContext(MarketContext);
  if (!market) throw new Error('useMarket must be used inside <MarketProvider>');
  return market;
}

/** Formats money in the active market's locale. */
export function useFormatMoney() {
  const { locale } = useMarket();
  return (money: Money) => formatMoney(money, locale);
}
