'use client';

import { useEffect } from 'react';
import { useWishlist } from '@/lib/stores/wishlist-store';

export function WishlistHydrator() {
  useEffect(() => {
    void useWishlist.persist.rehydrate();
  }, []);
  return null;
}
