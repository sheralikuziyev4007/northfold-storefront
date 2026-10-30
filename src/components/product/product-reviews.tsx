import { Stars } from '@/components/ui/stars';
import { formatDate } from '@/lib/format';
import type { ReviewSummary } from '@/lib/reviews';

export function ProductReviews({ summary }: { summary: ReviewSummary }) {
  return (
    <section
      aria-labelledby="reviews-heading"
      id="reviews"
      className="mt-24 flex scroll-mt-28 flex-wrap items-start gap-12"
    >
      <div className="flex max-w-[380px] flex-[1_1_300px] flex-col gap-4">
        <h2
          id="reviews-heading"
          className="font-semiwide text-[28px] font-extrabold tracking-[-0.02em] sm:text-[32px]"
        >
          Reviews
        </h2>
        <div className="flex items-baseline gap-2.5">
          <span className="font-semiwide text-[56px] leading-none font-extrabold">{summary.average}</span>
          <span className="text-muted text-[15px]">out of 5, from {summary.count} sample reviews</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold" id="fit-label">
            How it fits
          </span>
          <div
            role="meter"
            aria-labelledby="fit-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={summary.fit}
            aria-valuetext={
              summary.fit > 55
                ? 'Runs slightly large'
                : summary.fit < 45
                  ? 'Runs slightly small'
                  : 'True to size'
            }
            className="bg-line relative h-1.5 rounded-full"
          >
            <span
              className="bg-ink absolute -top-[5px] size-4 rounded-full"
              style={{ left: `calc(${summary.fit}% - 8px)` }}
            />
          </div>
          <div className="text-muted flex justify-between text-[13px]" aria-hidden="true">
            <span>Runs small</span>
            <span>True to size</span>
            <span>Runs large</span>
          </div>
        </div>
        <p className="text-muted text-sm">
          Reviews on this demo store are sample data and can’t be submitted.
        </p>
      </div>
      <ul className="flex min-w-0 flex-[999_1_520px] flex-col">
        {summary.reviews.map((r) => (
          <li key={r.id} className="border-line flex flex-col gap-2.5 border-t py-6">
            <div className="flex flex-wrap justify-between gap-2">
              <Stars rating={r.rating} />
              <span className="text-muted text-[13px]">{formatDate(r.date)}</span>
            </div>
            <h3 className="text-[17px] font-bold">{r.title}</h3>
            <p className="max-w-[62ch] text-[15px] leading-relaxed">{r.body}</p>
            <span className="text-muted text-[13px]">
              {r.author}, bought {r.variant}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
