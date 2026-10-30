'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFormatMoney } from '@/components/market/market-context';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { track, toItem } from '@/lib/analytics';
import { useUIStore } from '@/lib/stores/ui-store';
import type { CartLine } from '@/lib/shopify/types';
import { useCart } from './cart-context';

export function CartLineItem({ line }: { line: CartLine }) {
  const { setQuantity, removeLine } = useCart();
  const showToast = useUIStore((s) => s.showToast);
  const closeCart = useUIStore((s) => s.closeCart);
  const format = useFormatMoney();
  const { product } = line.merchandise;
  const optimistic = line.id.startsWith('optimistic-');
  const variantLabel = line.merchandise.selectedOptions
    .filter((o) => o.value !== 'Default Title')
    .map((o) => o.value)
    .join(' / ');

  async function change(quantity: number) {
    const result = quantity === 0 ? await removeLine(line.id) : await setQuantity(line.id, quantity);
    if (!result.ok) showToast(result.error);
    else if (quantity < line.quantity) {
      track({
        name: 'remove_from_cart',
        currency: line.cost.amountPerQuantity.currencyCode,
        value: Number(line.cost.amountPerQuantity.amount) * (line.quantity - quantity),
        items: [
          toItem({
            id: line.merchandise.id,
            title: product.title,
            variant: variantLabel,
            price: line.cost.amountPerQuantity,
            quantity: line.quantity - quantity,
          }),
        ],
      });
    }
  }

  return (
    <li className="border-line flex gap-3.5 border-b py-4">
      <Link
        href={`/products/${product.handle}`}
        onClick={closeCart}
        className="bg-tone-oat relative h-[104px] w-[84px] flex-none overflow-hidden rounded-[3px]"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            fill
            sizes="84px"
            className="object-cover"
          />
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${product.handle}`}
            onClick={closeCart}
            className="text-[15px] font-semibold no-underline"
          >
            {product.title}
          </Link>
          <span className="text-[15px] font-semibold">{format(line.cost.totalAmount)}</span>
        </div>
        {variantLabel ? <span className="text-muted text-sm">{variantLabel}</span> : null}
        <div className="mt-auto flex items-center justify-between">
          <div className="border-line bg-paper flex items-center rounded border">
            <button
              type="button"
              onClick={() => change(line.quantity - 1)}
              disabled={optimistic}
              aria-label={`Decrease quantity of ${product.title}`}
              className="grid size-9 place-items-center disabled:opacity-40"
            >
              <MinusIcon size={16} />
            </button>
            <span
              className="min-w-6 text-center text-sm"
              aria-live="polite"
              aria-label={`Quantity ${line.quantity}`}
            >
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => change(line.quantity + 1)}
              disabled={optimistic}
              aria-label={`Increase quantity of ${product.title}`}
              className="grid size-9 place-items-center disabled:opacity-40"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => change(0)}
            disabled={optimistic}
            className="text-muted h-9 text-[13px] underline underline-offset-2 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
