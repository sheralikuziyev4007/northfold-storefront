import Link from 'next/link';
import { CartButton } from '@/components/cart/cart-button';
import { SearchTrigger } from '@/components/search/search-trigger';
import { MAIN_NAV } from '@/lib/navigation';
import { CountrySelector } from './country-selector';
import { MainNavLinks } from './main-nav-links';
import { MobileMenu } from './mobile-menu';
import { WishlistLink } from './wishlist-link';

export function Header() {
  return (
    <header className="border-line bg-stone/95 supports-[backdrop-filter]:bg-stone/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-[1360px] items-center gap-x-6 px-2 py-1.5 sm:px-4 lg:gap-x-10 lg:px-8 lg:py-[18px]">
        <MobileMenu />
        <Link
          href="/"
          className="font-wide mx-auto text-[22px] font-extrabold tracking-[-0.02em] no-underline lg:mx-0 lg:text-[26px]"
        >
          Northfold
        </Link>
        <MainNavLinks items={MAIN_NAV} />
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="hidden lg:block">
            <CountrySelector />
          </div>
          <SearchTrigger />
          <div className="hidden sm:block">
            <WishlistLink />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
