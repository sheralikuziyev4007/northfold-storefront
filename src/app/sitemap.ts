import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/content/journal';
import { getCollections, getProducts } from '@/lib/shopify';
import { siteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts({ first: 250 }).catch(() => []),
    getCollections().catch(() => []),
  ]);
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/collections/all`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ...collections.map((c) => ({
      url: `${siteUrl}/collections/${c.handle}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${siteUrl}/products/${p.handle}`,
      lastModified: new Date(p.createdAt),
      priority: 0.7,
    })),
    { url: `${siteUrl}/journal`, lastModified: now, priority: 0.5 },
    ...ARTICLES.map((a) => ({
      url: `${siteUrl}/journal/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.4,
    })),
  ];
}
