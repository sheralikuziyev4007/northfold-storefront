import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductDetails } from '@/components/product/product-details';
import { ProductExperience } from '@/components/product/product-experience';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductLabel } from '@/components/product/product-label';
import { ProductReviews } from '@/components/product/product-reviews';
import { BreadcrumbJsonLd, ProductJsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { defaultSelection, selectionFromParams } from '@/lib/catalog/variants';
import { getMarket } from '@/lib/markets';
import { getReviewSummary } from '@/lib/product-reviews';
import { getCountry, getProduct, getProductRecommendations } from '@/lib/shopify';

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return { title: 'Product not found' };
  const image = product.featuredImage;
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      type: 'website',
      title: product.title,
      description: product.seo.description,
      images: image
        ? [{ url: image.url, width: image.width, height: image.height, alt: image.altText }]
        : undefined,
    },
  };
}

async function Recommendations({ productId, locale }: { productId: string; locale: string }) {
  const products = await getProductRecommendations(productId).catch(() => []);
  if (!products.length) return null;
  return (
    <section aria-labelledby="pairs-heading" className="mt-24">
      <SectionHeading id="pairs-heading" title="Pairs well with" />
      <ProductGrid products={products} locale={locale} label="Recommended products" />
    </section>
  );
}

export default async function ProductPage({ params, searchParams }: Props) {
  const [{ handle }, query, country] = await Promise.all([params, searchParams, getCountry()]);
  const product = await getProduct(handle);
  if (!product) notFound();

  const market = getMarket(country);
  const initialSelection = defaultSelection(product, selectionFromParams(product, query));
  const reviews = getReviewSummary(product);

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-5 pb-32 lg:px-8 lg:pt-7 lg:pb-24">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'New in', path: '/collections/all' },
          { name: product.title, path: `/products/${product.handle}` },
        ]}
      />
      <div className="mb-5">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'New in', href: '/collections/all' },
            { name: product.title },
          ]}
        />
      </div>

      <ProductExperience product={product} initialSelection={initialSelection} locale={market.locale}>
        <ProductLabel label={product.label} />
        <ProductDetails product={product} market={market} />
      </ProductExperience>

      <ProductReviews summary={reviews} />

      <Suspense
        fallback={
          <div className="mt-24">
            <ProductGridSkeleton count={4} label="Loading recommendations" />
          </div>
        }
      >
        <Recommendations productId={product.id} locale={market.locale} />
      </Suspense>
    </div>
  );
}
