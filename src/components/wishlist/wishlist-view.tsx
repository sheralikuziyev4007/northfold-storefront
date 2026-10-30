'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { useFormatMoney } from '@/components/market/market-context';
import { Button, ButtonLink } from '@/components/ui/button';
import { CloseIcon, HeartIcon } from '@/components/ui/icons';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { useUIStore } from '@/lib/stores/ui-store';
import { useWishlist, type WishlistItem } from '@/lib/stores/wishlist-store';

function WishlistCard({ item }: { item: WishlistItem }) {
  const remove = useWishlist((s) => s.remove);
  const { addToCart } = useCart();
  const openCart = useUIStore((s) => s.openCart);
  const showToast = useUIStore((s) => s.showToast);
  const format = useFormatMoney();
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle');
  const href = `/products/${item.handle}`;

  async function add() {
    if (!item.variantId) return;
    setState('adding');
    const result = await addToCart({
      variantId: item.variantId,
      variantTitle: item.variantLabel ?? 'Default Title',
      selectedOptions: [],
      price: item.price,
      product: { handle: item.handle, title: item.title, featuredImage: item.image },
    });
    if (!result.ok) {
      setState('idle');
      showToast(result.error);
      return;
    }
    setState('added');
    openCart();
  }

  return (
    <article className="flex flex-col gap-3">
      <div className="relative">
        <Link
          href={href}
          aria-label={item.title}
          className="bg-tone-oat relative block aspect-[4/5] overflow-hidden rounded"
        >
          {item.image ? (
            <Image
              src={item.image.url}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </Link>
        <button
          type="button"
          onClick={() => remove(item.handle)}
          aria-label={`Remove ${item.title} from wishlist`}
          className="bg-paper absolute top-2.5 right-2.5 grid size-11 place-items-center rounded-full"
        >
          <CloseIcon size={16} />
        </button>
        {!item.availableForSale ? (
          <span className="bg-ink text-paper absolute top-3 left-3 rounded-[3px] px-2.5 py-1.5 text-xs font-semibold">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link href={href} className="text-base font-semibold no-underline">
            {item.title}
          </Link>
          <span className="text-muted text-sm">
            {item.variantLabel ?? 'Choose options on the product page'}
          </span>
        </div>
        <span className="text-base font-semibold">{format(item.price)}</span>
      </div>
      {!item.availableForSale ? (
        <ButtonLink href={href} variant="secondary">
          See other sizes
        </ButtonLink>
      ) : item.variantId ? (
        <Button variant={state === 'added' ? 'success' : 'primary'} onClick={add} disabled={state !== 'idle'}>
          {state === 'adding' ? 'Adding…' : state === 'added' ? 'Added to cart' : 'Add to cart'}
        </Button>
      ) : (
        <ButtonLink href={href} variant="secondary">
          Choose a size
        </ButtonLink>
      )}
    </article>
  );
}

export function WishlistView() {
  const { items, hydrated, clear } = useWishlist();
  const count = items.length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-wide text-[40px] leading-[0.95] font-extrabold tracking-[-0.03em] sm:text-[clamp(40px,5vw,72px)]">
            Wishlist
          </h1>
          <p className="text-muted text-[15px]">
            {hydrated ? `${count} ${count === 1 ? 'item' : 'items'}. ` : ''}Saved on this device.
          </p>
        </div>
        {hydrated && count > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="h-11 px-2 text-[15px] underline underline-offset-2"
          >
            Remove all
          </button>
        ) : null}
      </div>

      {!hydrated ? (
        <ProductGridSkeleton count={4} label="Loading wishlist" />
      ) : count === 0 ? (
        <div className="bg-paper flex flex-col items-start gap-3.5 rounded px-8 py-14">
          <HeartIcon size={32} />
          <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
          <p className="text-muted max-w-[44ch] text-base leading-normal">
            Tap the heart on any product to save it here for later.
          </p>
          <ButtonLink href="/collections/all">Shop new arrivals</ButtonLink>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-x-5">
          {items.map((item) => (
            <li key={item.handle}>
              <WishlistCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
