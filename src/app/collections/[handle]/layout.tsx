import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCollectionWithProducts } from '@/lib/shopify';

/**
 * Checks that the collection exists before the loading skeleton streams, so a missing handle answers
 * with HTTP 404 instead of 200. The lookup is cached per request, so the page reuses this result.
 */
export default async function CollectionLayout({
  params,
  children,
}: {
  params: Promise<{ handle: string }>;
  children: ReactNode;
}) {
  if (!(await getCollectionWithProducts((await params).handle))) notFound();
  return children;
}
