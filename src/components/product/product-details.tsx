import { formatMoney, money } from '@/lib/format';
import type { Market } from '@/lib/markets';
import type { Product } from '@/lib/shopify/types';

function Item({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group border-line-soft border-b" open={open}>
      <summary className="flex min-h-[52px] cursor-pointer items-center justify-between px-4.5 text-[15px] font-bold">
        {title}
        <span aria-hidden="true" className="text-xl font-normal group-open:hidden">
          +
        </span>
        <span aria-hidden="true" className="hidden text-xl font-normal group-open:inline">
          −
        </span>
      </summary>
      <div className="text-muted px-4.5 pb-4.5 text-sm leading-relaxed">{children}</div>
    </details>
  );
}

/** Uses native <details>, so it works before JavaScript loads. */
export function ProductDetails({ product, market }: { product: Product; market: Market }) {
  const threshold = formatMoney(money(market.freeShippingThreshold, market.currency), market.locale);
  return (
    <div id="details" className="bg-paper scroll-mt-28 p-2">
      <div className="border-stitch border-[1.5px] border-dashed [&>details:last-child]:border-b-0">
        {product.description ? (
          <Item title="Description" open>
            <p>{product.description}</p>
          </Item>
        ) : null}
        {product.label.fit ? (
          <Item title="Fit and sizing">
            <p>{product.label.fit}</p>
          </Item>
        ) : null}
        <Item title="Shipping and returns">
          <p>
            Ships in 1–2 business days. Free shipping to {market.name} on orders over {threshold}. Free
            returns within 30 days of delivery.
          </p>
        </Item>
      </div>
    </div>
  );
}
