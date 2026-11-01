import { pickCardColors } from '@/lib/catalog/card-colors';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';

export function ProductGrid({
  products,
  locale,
  className,
  priorityCount = 0,
  label,
  headingLevel = 3,
  preferredColors,
}: {
  products: Product[];
  locale: string;
  className?: string;
  priorityCount?: number;
  label?: string;
  headingLevel?: 2 | 3;
  /** Colours chosen in the filters; matching cards show that colour. */
  preferredColors?: string[];
}) {
  const cardColors = pickCardColors(products, preferredColors);
  return (
    <ul
      aria-label={label}
      className={cn(
        'grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-x-5',
        className,
      )}
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            locale={locale}
            priority={i < priorityCount}
            headingLevel={headingLevel}
            color={cardColors[i] ?? null}
          />
        </li>
      ))}
    </ul>
  );
}
