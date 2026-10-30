import { StarIcon } from './icons';

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="text-ink flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} filled={n <= rounded} />
      ))}
    </span>
  );
}
