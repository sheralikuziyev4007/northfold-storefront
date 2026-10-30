'use client';

import { BagIcon } from '@/components/ui/icons';
import { useUIStore } from '@/lib/stores/ui-store';
import { useCart } from './cart-context';

export function CartButton() {
  const { cart } = useCart();
  const openCart = useUIStore((s) => s.openCart);
  const count = cart.totalQuantity;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="hover:bg-paper/70 relative grid size-11 place-items-center rounded-md"
    >
      <BagIcon />
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="bg-loden text-paper absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[11px] font-bold"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
