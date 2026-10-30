import { formatMoney, money } from '@/lib/format';
import type { Market } from '@/lib/markets';

export function AnnouncementBar({ market }: { market: Market }) {
  const threshold = formatMoney(money(market.freeShippingThreshold, market.currency), market.locale);
  return (
    <div className="bg-ink text-stone px-4 py-2.5 text-center text-[13px]">
      Free shipping to {market.name} on orders over {threshold}. Free returns within 30 days.
    </div>
  );
}
