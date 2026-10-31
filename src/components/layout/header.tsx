import Link from 'next/link';
import { CartButton } from '@/components/cart/cart-button';
import { SearchTrigger } from '@/components/search/search-trigger';
import { mainNav } from '@/lib/navigation';
import { getCollectionLinks } from '@/lib/shop-nav';
import { isMarketsEnabled } from '@/lib/shopify';
import { CountrySelector } from './country-selector';
import { MainNavLinks } from './main-nav-links';
import { MobileMenu } from './mobile-menu';
import { WishlistLink } from './wishlist-link';

export async function Header() {
  const nav = mainNav(await getCollectionLinks());
  const showMarkets = isMarketsEnabled();
  return (
    <header className="border-line bg-stone/95 supports-[backdrop-filter]:bg-stone/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-[1360px] items-center gap-x-6 px-2 py-1.5 sm:px-4 lg:gap-x-10 lg:px-8 lg:py-[18px]">
        <MobileMenu items={nav} showCountries={showMarkets} />
        <Link
          href="/"
          className="font-wide mx-auto text-[22px] font-extrabold tracking-[-0.02em] no-underline lg:mx-0 lg:text-[26px]"
        >
          Northfold
        </Link>
        <MainNavLinks items={nav} />
        <div className="flex items-center gap-1 lg:gap-2">
          {showMarkets ? (
            <div className="hidden lg:block">
              <CountrySelector />
            </div>
          ) : null}
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
