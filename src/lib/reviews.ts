/**
 * Sample reviews. Shopify has no native reviews API, so production stores read them from an
 * app such as Judge.me or Okendo. This module stands in for that integration and labels every
 * review as sample data in the UI. Reviews are not emitted as structured data.
 */
export type Review = {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  variant: string;
  date: string;
};

export type ReviewSummary = { average: number; count: number; fit: number; reviews: Review[] };

const POOL: Omit<Review, 'id' | 'variant'>[] = [
  {
    rating: 5,
    title: 'Heavier than I expected',
    body: 'Proper weight to it. After a dozen washes there is no pilling and it still holds its shape.',
    author: 'Sample reviewer A',
    date: '2026-10-14',
  },
  {
    rating: 4,
    title: 'Roomy in the body',
    body: 'Fits true in the shoulders but wide in the body. Sleeves are a touch long, which I like.',
    author: 'Sample reviewer D',
    date: '2026-10-02',
  },
  {
    rating: 5,
    title: 'Colour is exactly as shown',
    body: 'Muted and easy to wear with everything I own. Ordering a second one.',
    author: 'Sample reviewer E',
    date: '2026-09-21',
  },
  {
    rating: 4,
    title: 'Good, size down',
    body: 'Well made and the stitching is neat, but it runs a size big. The exchange was quick.',
    author: 'Sample reviewer F',
    date: '2026-09-09',
  },
  {
    rating: 5,
    title: 'Worn it every week since',
    body: 'The fabric softened after a few wears without losing structure. No loose threads anywhere.',
    author: 'Sample reviewer G',
    date: '2026-08-30',
  },
];

function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

/** Deterministic: the same product always shows the same sample reviews. */
export function getSampleReviews(handle: string, variantLabels: string[]): ReviewSummary {
  const seed = hash(handle);
  const count = 3;
  const reviews = Array.from({ length: count }, (_, i) => {
    const base = POOL[(seed + i * 2) % POOL.length]!;
    return {
      ...base,
      id: `${handle}-${i}`,
      variant: variantLabels.length ? variantLabels[(seed + i) % variantLabels.length]! : 'One size',
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
  const average = Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10;
  return { average, count, fit: 50 + (seed % 3) * 4, reviews };
}

export const HOME_REVIEWS = [
  {
    rating: 5,
    body: 'Washed it maybe forty times. The cuffs still snap back and the colour has only got better.',
    author: 'Sample reviewer A',
    item: 'Heavyweight hoodie, Loden, L',
  },
  {
    rating: 4,
    body: 'Thick, structured cotton. Runs a little boxy, so I sized down and it is right.',
    author: 'Sample reviewer B',
    item: 'Boxy pocket tee, Oat, M',
  },
  {
    rating: 5,
    body: 'The zip broke after a fall. They repaired it and sent it back within two weeks.',
    author: 'Sample reviewer C',
    item: 'Canvas chore jacket, Khaki, XL',
  },
];
