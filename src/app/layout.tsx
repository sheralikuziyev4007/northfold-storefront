import '@fontsource-variable/archivo/wdth.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { CartProvider } from '@/components/cart/cart-context';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ConsentBanner } from '@/components/consent/consent-banner';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MarketProvider } from '@/components/market/market-context';
import { SearchDialog } from '@/components/search/search-dialog';
import { Toaster } from '@/components/ui/toast';
import { WishlistHydrator } from '@/components/wishlist/wishlist-hydrator';
import { HERO_PHOTO } from '@/content/photos';
import { getMarket } from '@/lib/markets';
import { getCollectionLinks } from '@/lib/shop-nav';
import { getCart, getCountry } from '@/lib/shopify';
import { siteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Northfold — Clothes built for the long haul', template: '%s | Northfold' },
  description:
    'Heavyweight cotton, honest seams and colours that age well. Small-run clothing from Northfold, a headless Shopify storefront.',
  openGraph: {
    type: 'website',
    siteName: 'Northfold',
    locale: 'en_US',
    images: [{ url: HERO_PHOTO.src, alt: HERO_PHOTO.alt }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#ECECE7',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [market, collectionLinks] = await Promise.all([getCountry().then(getMarket), getCollectionLinks()]);
  // A failing cart request must not take the whole page down; the cart renders empty instead.
  const cartPromise = getCart().catch((error: unknown) => {
    console.error(error);
    return null;
  });

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="bg-ink text-paper sr-only z-50 px-4 py-3 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <MarketProvider market={market}>
          <CartProvider cartPromise={cartPromise}>
            <AnnouncementBar market={market} />
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <SearchDialog collections={collectionLinks} />
            <Toaster />
            <ConsentBanner />
            <WishlistHydrator />
          </CartProvider>
        </MarketProvider>
      </body>
    </html>
  );
}
