import { notFound } from 'next/navigation';
import { COLLECTION_SPECS, PRODUCT_SPECS } from '@/lib/shopify/fixtures/catalog';
import { collectionSvg, productSvg } from '@/lib/shopify/fixtures/svg';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const products = PRODUCT_SPECS.flatMap((spec) =>
    spec.colors.flatMap((color) =>
      [1, 2, 3].map((view) => ({ path: [spec.handle, slugify(color), String(view)] })),
    ),
  );
  const collections = [...COLLECTION_SPECS.map((c) => c.handle), 'hero'].map((handle) => ({
    path: ['collection', handle, '1'],
  }));
  return [...products, ...collections];
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const [first, second, third] = (await params).path;
  let svg: string | null = null;

  if (first === 'collection' && second) {
    svg = collectionSvg(second);
  } else {
    const spec = PRODUCT_SPECS.find((s) => s.handle === first);
    const view = Number(third);
    if (spec && second && spec.colors.some((c) => slugify(c) === second) && view >= 1 && view <= 3) {
      svg = productSvg(spec.silhouette, second, view);
    }
  }

  if (!svg) notFound();
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
