import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Price } from '@/components/product/price';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getArticle } from '@/content/journal';
import { formatDate } from '@/lib/format';
import { getMarket } from '@/lib/markets';
import { getCountry, getProduct } from '@/lib/shopify';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

async function StoryProducts({ handles }: { handles: string[] }) {
  const [products, country] = await Promise.all([
    Promise.all(handles.map((h) => getProduct(h).catch(() => null))),
    getCountry(),
  ]);
  const found = products.filter((p) => p !== null);
  // Handles come from the sample catalog; a live store may not carry them.
  if (!found.length) return null;
  const { locale } = getMarket(country);

  return (
    <section aria-labelledby="in-story" className="mx-auto max-w-[1160px] px-5 pt-8 pb-24 lg:px-8">
      <h2 id="in-story" className="font-semiwide mb-5 text-[26px] font-extrabold">
        Products in this story
      </h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
        {found.map((p) => (
          <li key={p.id}>
            <Link
              href={`/products/${p.handle}`}
              className="bg-paper hover:shadow-lift flex items-center gap-3.5 rounded p-3 no-underline"
            >
              <span className="bg-tone-oat relative h-20 w-16 flex-none overflow-hidden rounded-[3px]">
                {p.featuredImage ? (
                  <Image src={p.featuredImage.url} alt="" fill sizes="64px" className="object-cover" />
                ) : null}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[15px] font-semibold">{p.title}</span>
                <span className="text-muted text-sm">
                  {p.label.fabricWeight ? `${p.label.fabricWeight}, ` : ''}
                  <Price price={p.priceRange.min} locale={locale} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  return (
    <article>
      <BreadcrumbJsonLd
        items={[
          { name: 'Journal', path: '/journal' },
          { name: article.title, path: `/journal/${article.slug}` },
        ]}
      />
      <header className="mx-auto flex max-w-[760px] flex-col gap-4.5 px-5 pt-12 pb-8 lg:px-8">
        <Breadcrumbs items={[{ name: 'Journal', href: '/journal' }, { name: article.topic }]} />
        <h1 className="font-wide text-[38px] leading-none font-extrabold tracking-[-0.03em] sm:text-[clamp(38px,5vw,64px)]">
          {article.title}
        </h1>
        <p className="text-muted text-[15px]">
          <time dateTime={article.date}>{formatDate(article.date)}</time>, {article.readingMinutes} min read
        </p>
      </header>
      <div className="mx-auto max-w-[1160px] px-5 lg:px-8">
        <div aria-hidden="true" className="aspect-[21/9] rounded" style={{ background: article.tone }} />
      </div>
      <div className="mx-auto flex max-w-[680px] flex-col gap-5.5 px-5 pt-12 pb-8 text-lg leading-[1.7] lg:px-8">
        {article.body.map((block, i) =>
          block.type === 'h2' ? (
            <h2 key={i} className="font-semiwide mt-4 text-[26px] leading-tight font-extrabold">
              {block.text}
            </h2>
          ) : (
            <p key={i}>{block.text}</p>
          ),
        )}
      </div>
      <StoryProducts handles={article.productHandles} />
    </article>
  );
}
