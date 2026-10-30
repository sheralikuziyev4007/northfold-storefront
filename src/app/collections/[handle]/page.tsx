import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActiveFilters, MobileFilterButton, SortSelect } from '@/components/catalog/catalog-toolbar';
import { FilterControls } from '@/components/catalog/filter-controls';
import { ViewListTracker } from '@/components/catalog/view-list-tracker';
import { ProductGrid } from '@/components/product/product-grid';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { buttonClasses } from '@/components/ui/button';
import { toItem } from '@/lib/analytics';
import {
  applyFilters,
  buildFacets,
  filtersToSearchParams,
  PAGE_SIZE,
  parseFilters,
} from '@/lib/catalog/filters';
import { getMarket } from '@/lib/markets';
import { getCollectionWithProducts, getCountry } from '@/lib/shopify';

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCollectionWithProducts((await params).handle);
  if (!data) return { title: 'Collection not found' };
  return {
    title: data.collection.title,
    description: data.collection.description || `Shop ${data.collection.title} at Northfold.`,
    alternates: { canonical: `/collections/${data.collection.handle}` },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ handle }, query, country] = await Promise.all([params, searchParams, getCountry()]);
  const data = await getCollectionWithProducts(handle);
  if (!data) notFound();

  const market = getMarket(country);
  const filters = parseFilters(query);
  const facets = buildFacets(data.products);
  const results = applyFilters(data.products, filters);
  const visible = results.slice(0, filters.show);
  const hasMore = results.length > visible.length;
  const filtered = results.length !== data.products.length;
  const moreHref = `/collections/${handle}?${filtersToSearchParams({ ...filters, show: filters.show + PAGE_SIZE })}`;

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-6 pb-24 lg:px-8 lg:pt-8">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: data.collection.title, path: `/collections/${handle}` },
        ]}
      />
      <div className="mb-3.5">
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: data.collection.title }]} />
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-wide text-[40px] leading-[0.95] font-extrabold tracking-[-0.03em] sm:text-[clamp(40px,5vw,72px)]">
            {data.collection.title}
          </h1>
          <p className="text-muted text-[15px]" aria-live="polite">
            {filtered
              ? `${results.length} of ${data.products.length} products match`
              : `${data.products.length} products`}
          </p>
        </div>
        <SortSelect filters={filters} />
        <MobileFilterButton
          filters={filters}
          facets={facets}
          currencySymbol={market.symbol}
          resultCount={results.length}
        />
      </div>

      <div className="flex flex-wrap items-start gap-10">
        <aside aria-label="Filters" className="hidden max-w-[280px] flex-[1_1_240px] lg:block">
          <FilterControls filters={filters} facets={facets} currencySymbol={market.symbol} idPrefix="d" />
        </aside>

        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
          <ActiveFilters filters={filters} currencySymbol={market.symbol} />

          {visible.length ? (
            <ProductGrid
              products={visible}
              locale={market.locale}
              priorityCount={4}
              label={`${data.collection.title} products`}
              headingLevel={2}
            />
          ) : (
            <div className="bg-paper flex flex-col items-start gap-3 rounded px-8 py-12">
              <h2 className="text-[22px] font-bold">Nothing matches these filters</h2>
              <p className="text-muted text-[15px]">
                Remove a size, colour or price limit to see more products.
              </p>
              <Link href={`/collections/${handle}`} className={buttonClasses('primary', 'md')}>
                Clear filters
              </Link>
            </div>
          )}

          {visible.length ? (
            <div className="flex flex-col items-center gap-3 pt-6">
              <span className="text-muted text-sm">
                Showing {visible.length} of {results.length}
              </span>
              <div
                className="bg-line h-[3px] w-[220px] rounded-sm"
                role="progressbar"
                aria-label="Products shown"
                aria-valuemin={0}
                aria-valuemax={results.length}
                aria-valuenow={visible.length}
              >
                <div
                  className="bg-ink h-[3px] rounded-sm"
                  style={{ width: `${(visible.length / results.length) * 100}%` }}
                />
              </div>
              {hasMore ? (
                <Link href={moreHref} scroll={false} className={buttonClasses('secondary', 'md')}>
                  Load more
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <ViewListTracker
        listName={data.collection.title}
        items={visible.map((p) =>
          toItem({ id: p.id, title: p.title, category: p.productType, price: p.priceRange.min }),
        )}
      />
    </div>
  );
}
