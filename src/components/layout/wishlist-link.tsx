'use client';

import Link from 'next/link';
import { HeartIcon } from '@/components/ui/icons';
import { useWishlist } from '@/lib/stores/wishlist-store';

export function WishlistLink() {
  const count = useWishlist((s) => (s.hydrated ? s.items.length : 0));
  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="hover:bg-paper/70 relative grid size-11 place-items-center rounded-md"
    >
      <HeartIcon filled={count > 0} />
    </Link>
  );
}
