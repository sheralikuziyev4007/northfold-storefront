import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/product-grid';
import { buttonClasses } from '@/components/ui/button';
import { SearchIcon } from '@/components/ui/icons';
import { getMarket } from '@/lib/markets';
import { getCountry, searchProducts } from '@/lib/shopify';

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (await searchParams).q?.trim();
  return { title: q ? `Search results for “${q}”` : 'Search', robots: { index: false } };
}

export default async function SearchPage({ searchParams }: Props) {
  const [{ q = '' }, country] = await Promise.all([searchParams, getCountry()]);
  const query = q.trim().slice(0, 80);
  const products = query ? await searchProducts(query, 48) : [];
  const { locale } = getMarket(country);

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 pt-10 pb-24 lg:px-8">
      <div className="flex flex-col gap-4">
        <h1 className="font-wide text-[36px] leading-none font-extrabold tracking-[-0.03em] sm:text-5xl">
          {query ? `Results for “${query}”` : 'Search'}
        </h1>
        <form action="/search" role="search" className="flex max-w-xl flex-wrap gap-2.5">
          <label htmlFor="search-page-q" className="sr-only">
            Search products
          </label>
          <input
            id="search-page-q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Hoodie, chore jacket, beanie…"
            className="border-ink bg-paper h-12 min-w-[220px] flex-1 rounded-md border-[1.5px] px-4 text-base"
          />
          <button type="submit" className={buttonClasses('primary', 'md')}>
            <SearchIcon size={18} />
            Search
          </button>
        </form>
        {query ? (
          <p className="text-muted text-[15px]" aria-live="polite">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        ) : null}
      </div>

      {query && !products.length ? (
        <div className="bg-paper flex flex-col items-start gap-3 rounded px-8 py-12">
          <h2 className="text-[22px] font-bold">No products match “{query}”</h2>
          <p className="text-muted text-[15px]">Check the spelling or try a broader word, like “jacket”.</p>
          <Link href="/collections/all" className={buttonClasses('primary', 'md')}>
            Browse everything
          </Link>
        </div>
      ) : (
        <ProductGrid
          products={products}
          locale={locale}
          priorityCount={4}
          label="Search results"
          headingLevel={2}
        />
      )}
    </div>
  );
}
