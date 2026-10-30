import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { TAGS } from '@/lib/shopify/client';

/**
 * Shopify webhook target (products/create, products/update, products/delete, collections/*).
 * Point the webhook at /api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
  if (!secret || request.nextUrl.searchParams.get('secret') !== secret) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }

  const topic = request.headers.get('x-shopify-topic') ?? '';
  const tags = topic.startsWith('collections/') ? [TAGS.collections] : [TAGS.products, TAGS.collections];
  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
