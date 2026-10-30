import { BrandStory } from '@/components/home/brand-story';
import { CollectionsGrid } from '@/components/home/collections-grid';
import { Hero } from '@/components/home/hero';
import { HomeReviews } from '@/components/home/home-reviews';
import { JournalTeaser } from '@/components/home/journal-teaser';
import { Newsletter } from '@/components/home/newsletter';
import { ProductGrid } from '@/components/product/product-grid';
import { OrganizationJsonLd } from '@/components/seo/json-ld';
import { SectionHeading } from '@/components/ui/section-heading';
import { getMarket } from '@/lib/markets';
import { getCollections, getCountry, getProducts } from '@/lib/shopify';

async function Collections() {
  const collections = await getCollections().catch(() => []);
  return <CollectionsGrid collections={collections} />;
}

async function NewArrivals() {
  const [products, country] = await Promise.all([
    getProducts({ newestFirst: true, first: 4 }).catch(() => null),
    getCountry(),
  ]);
  if (!products?.length) return null;
  return <ProductGrid products={products} locale={getMarket(country).locale} label="New arrivals" />;
}

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Hero />
      <Collections />
      <section aria-labelledby="new-arrivals" className="mx-auto max-w-[1360px] px-5 pb-24 lg:px-8">
        <SectionHeading
          id="new-arrivals"
          title="New arrivals"
          action={{ href: '/collections/all', label: 'View all new arrivals' }}
        />
        <NewArrivals />
      </section>
      <HomeReviews />
      <BrandStory />
      <JournalTeaser />
      <Newsletter />
    </>
  );
}
