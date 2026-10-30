import { getSampleReviews } from './reviews';
import type { Product } from './shopify/types';

export function getReviewSummary(product: Product) {
  const labels = product.variants
    .filter((v) => v.title !== 'Default Title')
    .map((v) => v.selectedOptions.map((o) => o.value).join(', '));
  return getSampleReviews(product.handle, labels);
}
