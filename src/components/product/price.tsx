import { formatMoney } from '@/lib/format';
import type { Money } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

export function Price({
  price,
  compareAt,
  locale,
  className,
}: {
  price: Money;
  compareAt?: Money | null;
  locale: string;
  className?: string;
}) {
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={onSale ? 'text-danger' : undefined}>
        {onSale ? <span className="sr-only">Sale price </span> : null}
        {formatMoney(price, locale)}
      </span>
      {onSale ? (
        <s className="text-muted text-[0.9em] font-normal">
          <span className="sr-only">Original price </span>
          {formatMoney(compareAt, locale)}
        </s>
      ) : null}
    </span>
  );
}
