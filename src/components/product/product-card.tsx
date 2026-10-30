import Image from 'next/image';
import Link from 'next/link';
import { swatchFor } from '@/lib/catalog/swatches';
import type { Product } from '@/lib/shopify/types';
import { pluralize } from '@/lib/utils';
import { Price } from './price';

export function colorValues(product: Product): string[] {
  return product.options.find((o) => /^colou?r$/i.test(o.name))?.values ?? [];
}

export function ProductCard({
  product,
  locale,
  priority = false,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  headingLevel = 3,
}: {
  product: Product;
  locale: string;
  priority?: boolean;
  sizes?: string;
  /** 2 when the grid sits directly under the page's h1, 3 under a section heading. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const colors = colorValues(product);
  const firstVariant = product.variants[0];
  const compareAt = firstVariant?.compareAtPrice ?? null;
  const onSale = compareAt && Number(compareAt.amount) > Number(product.priceRange.min.amount);
  const isNew = product.tags.includes('new');
  const href = `/products/${product.handle}`;

  return (
    <article className="group relative flex flex-col gap-3">
      <Link
        href={href}
        className="bg-tone-oat relative block aspect-[4/5] overflow-hidden rounded"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {!product.availableForSale ? (
          <span className="bg-ink text-paper absolute top-3 left-3 rounded-[3px] px-2.5 py-1.5 text-xs font-semibold">
            Sold out
          </span>
        ) : onSale ? (
          <span className="bg-paper text-danger absolute top-3 left-3 rounded-[3px] px-2.5 py-1.5 text-xs font-semibold">
            Sale
          </span>
        ) : isNew ? (
          <span className="bg-paper absolute top-3 left-3 rounded-[3px] px-2.5 py-1.5 text-xs font-semibold">
            Just in
          </span>
        ) : null}
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading className="text-[15px] leading-snug font-semibold sm:text-base">
            <Link href={href} className="no-underline after:absolute after:inset-0 after:content-['']">
              {product.title}
            </Link>
          </Heading>
          {colors.length > 1 ? (
            <span className="text-muted text-sm">{pluralize(colors.length, 'colour')}</span>
          ) : null}
        </div>
        <Price
          price={product.priceRange.min}
          compareAt={onSale ? compareAt : null}
          locale={locale}
          className="flex-col items-end gap-0 text-[15px] font-semibold sm:flex-row sm:gap-2 sm:text-base"
        />
      </div>
      {colors.length > 1 ? (
        <div className="flex gap-1.5" aria-hidden="true">
          {colors.slice(0, 6).map((c) => (
            <span
              key={c}
              title={c}
              className="size-4 rounded-full shadow-[inset_0_0_0_1px_rgb(30_36_34/0.2)]"
              style={{ background: swatchFor(c) }}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
