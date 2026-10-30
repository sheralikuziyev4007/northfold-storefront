import { NextResponse, type NextRequest } from 'next/server';
import { formatMoney } from '@/lib/format';
import { getMarket } from '@/lib/markets';
import { getCountry, searchProducts } from '@/lib/shopify';

export type SearchResult = {
  handle: string;
  title: string;
  productType: string;
  price: string;
  image: { url: string; altText: string } | null;
};

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get('q') ?? '').slice(0, 80);
  if (!query.trim()) return NextResponse.json({ results: [] });

  try {
    const [products, country] = await Promise.all([searchProducts(query, 6), getCountry()]);
    const locale = getMarket(country).locale;
    const results: SearchResult[] = products.map((p) => ({
      handle: p.handle,
      title: p.title,
      productType: p.productType,
      price: formatMoney(p.priceRange.min, locale),
      image: p.featuredImage ? { url: p.featuredImage.url, altText: p.featuredImage.altText } : null,
    }));
    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Search is unavailable right now.' }, { status: 502 });
  }
}
