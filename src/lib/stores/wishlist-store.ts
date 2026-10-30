import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Image, Money } from '@/lib/shopify/types';

export type WishlistItem = {
  handle: string;
  title: string;
  /** Variant to add when moving the item to the cart. Null when the product needs a size choice. */
  variantId: string | null;
  variantLabel: string | null;
  price: Money;
  image: Image | null;
  availableForSale: boolean;
  savedAt: string;
};

type WishlistState = {
  items: WishlistItem[];
  hydrated: boolean;
  toggle: (item: Omit<WishlistItem, 'savedAt'>) => boolean;
  remove: (handle: string) => void;
  clear: () => void;
  has: (handle: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      toggle: (item) => {
        const exists = get().items.some((i) => i.handle === item.handle);
        set({
          items: exists
            ? get().items.filter((i) => i.handle !== item.handle)
            : [{ ...item, savedAt: new Date().toISOString() }, ...get().items],
        });
        return !exists;
      },
      remove: (handle) => set({ items: get().items.filter((i) => i.handle !== handle) }),
      clear: () => set({ items: [] }),
      has: (handle) => get().items.some((i) => i.handle === handle),
    }),
    {
      name: 'nf_wishlist',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Rehydrated after mount (see WishlistHydrator) so server and first client render match.
      skipHydration: true,
      onRehydrateStorage: () => () => useWishlist.setState({ hydrated: true }),
    },
  ),
);
