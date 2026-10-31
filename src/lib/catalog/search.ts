import type { Product } from '@/lib/shopify/types';

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** "jackets" also finds "jacket"; short words are kept as typed. */
const stem = (word: string) => (word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word);

/**
 * Keeps the products whose title, type, vendor, tags or handle contain every word of the query,
 * with title matches first. Used when the Storefront endpoint does not filter by query itself.
 */
export function filterProductsByQuery(products: Product[], query: string): Product[] {
  const words = normalize(query).split(' ').filter(Boolean).map(stem);
  if (words.length === 0) return [];

  const scored: { product: Product; score: number; index: number }[] = [];
  products.forEach((product, index) => {
    const title = normalize(product.title);
    const haystack = normalize(
      [product.title, product.productType, product.vendor, product.handle, ...product.tags].join(' '),
    );
    if (!words.every((word) => haystack.includes(word))) return;
    const inTitle = words.filter((word) => title.includes(word)).length;
    const startsTitle = title.startsWith(words[0] ?? '') ? 1 : 0;
    scored.push({ product, score: inTitle * 2 + startsTitle, index });
  });

  return scored.sort((a, b) => b.score - a.score || a.index - b.index).map((entry) => entry.product);
}
