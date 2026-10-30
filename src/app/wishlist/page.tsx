import type { Metadata } from 'next';
import { WishlistView } from '@/components/wishlist/wishlist-view';

export const metadata: Metadata = {
  title: 'Wishlist',
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 pt-10 pb-24 lg:px-8 lg:pt-12">
      <WishlistView />
    </div>
  );
}
