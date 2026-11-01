import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getProduct } from '@/lib/shopify';

/**
 * Checks that the product exists before the loading skeleton streams, so a missing handle answers
 * with HTTP 404 instead of 200. getProduct is cached per request, so the page reuses this result.
 */
export default async function ProductLayout({
  params,
  children,
}: {
  params: Promise<{ handle: string }>;
  children: ReactNode;
}) {
  if (!(await getProduct((await params).handle))) notFound();
  return children;
}
