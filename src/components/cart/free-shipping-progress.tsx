'use client';

import { useFormatMoney, useMarket } from '@/components/market/market-context';
import { money } from '@/lib/format';
import type { Money } from '@/lib/shopify/types';

export function FreeShippingProgress({ subtotal }: { subtotal: Money }) {
  const market = useMarket();
  const format = useFormatMoney();
  const amount = Number(subtotal.amount);
  const threshold = market.freeShippingThreshold;
  const left = Math.max(0, threshold - amount);
  const percent = Math.min(100, Math.round((amount / threshold) * 100));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm" aria-live="polite">
        {left > 0
          ? `Add ${format(money(left, subtotal.currencyCode))} more for free shipping`
          : 'Your order ships free'}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="bg-line h-1 overflow-hidden rounded-sm"
      >
        <div
          className="bg-loden h-1 rounded-sm transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
