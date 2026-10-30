'use client';

import { HeartIcon } from '@/components/ui/icons';
import { track, toItem } from '@/lib/analytics';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { useWishlist } from '@/lib/stores/wishlist-store';
import { cn } from '@/lib/utils';

export function WishlistButton({
  product,
  variant,
  className,
}: {
  product: Product;
  variant?: ProductVariant;
  className?: string;
}) {
  const saved = useWishlist((s) => s.hydrated && s.items.some((i) => i.handle === product.handle));
  const toggle = useWishlist((s) => s.toggle);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      onClick={() => {
        const price = variant?.price ?? product.priceRange.min;
        const added = toggle({
          handle: product.handle,
          title: product.title,
          variantId: variant?.id ?? (product.variants.length === 1 ? product.variants[0]!.id : null),
          variantLabel: variant && variant.title !== 'Default Title' ? variant.title : null,
          price,
          image: variant?.image ?? product.featuredImage,
          availableForSale: variant?.availableForSale ?? product.availableForSale,
        });
        if (added) {
          track({
            name: 'add_to_wishlist',
            currency: price.currencyCode,
            value: Number(price.amount),
            items: [
              toItem({ id: variant?.id ?? product.id, title: product.title, variant: variant?.title, price }),
            ],
          });
        }
      }}
      className={cn(
        'border-line bg-paper text-ink hover:border-ink grid size-14 flex-none place-items-center rounded-md border-[1.5px]',
        className,
      )}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
