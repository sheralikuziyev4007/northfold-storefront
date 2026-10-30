'use client';

import Link from 'next/link';
import { useFormatMoney } from '@/components/market/market-context';
import { buttonClasses } from '@/components/ui/button';
import { CloseIcon } from '@/components/ui/icons';
import { Sheet } from '@/components/ui/sheet';
import { track, toItem } from '@/lib/analytics';
import { useUIStore } from '@/lib/stores/ui-store';
import { useCart } from './cart-context';
import { CartLineItem } from './cart-line-item';
import { FreeShippingProgress } from './free-shipping-progress';

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const close = useUIStore((s) => s.closeCart);
  const { cart, pending } = useCart();
  const format = useFormatMoney();
  const empty = cart.lines.length === 0;

  function onCheckout() {
    track({
      name: 'begin_checkout',
      currency: cart.cost.subtotalAmount.currencyCode,
      value: Number(cart.cost.subtotalAmount.amount),
      items: cart.lines.map((l) =>
        toItem({
          id: l.merchandise.id,
          title: l.merchandise.product.title,
          variant: l.merchandise.title,
          price: l.cost.amountPerQuantity,
          quantity: l.quantity,
        }),
      ),
    });
  }

  return (
    <Sheet open={open} onClose={close} label="Cart" placement="right">
      <div className="flex h-full flex-col">
        <div className="border-line flex items-center justify-between border-b py-4 pr-3 pl-6">
          <h2 className="font-semiwide text-[22px] font-extrabold">Your cart ({cart.totalQuantity})</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="grid size-11 place-items-center"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {!empty ? (
          <div className="border-line border-b px-6 py-4">
            <FreeShippingProgress subtotal={cart.cost.subtotalAmount} />
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {empty ? (
            <div className="flex flex-col items-start gap-3 py-12">
              <p className="text-lg font-bold">Your cart is empty</p>
              <p className="text-muted text-[15px]">Browse new arrivals and add something you like.</p>
              <Link
                href="/collections/all"
                onClick={close}
                className="text-[15px] font-semibold underline underline-offset-4"
              >
                Shop new arrivals
              </Link>
            </div>
          ) : (
            <ul aria-label="Items in your cart" aria-busy={pending}>
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
          )}
        </div>

        {!empty ? (
          <div className="border-line bg-paper flex flex-col gap-3.5 border-t px-6 py-5">
            <div className="flex justify-between text-[17px] font-bold">
              <span>Subtotal</span>
              <span>{format(cart.cost.subtotalAmount)}</span>
            </div>
            <p className="text-muted text-[13px]">
              Shipping, taxes and discount codes are calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl || '/checkout'}
              onClick={onCheckout}
              aria-disabled={pending || !cart.checkoutUrl}
              className={buttonClasses(
                'primary',
                'lg',
                pending ? 'pointer-events-none opacity-70' : undefined,
              )}
            >
              Check out
            </a>
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}
