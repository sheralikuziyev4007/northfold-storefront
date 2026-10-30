import { SectionHeading } from '@/components/ui/section-heading';
import { Stars } from '@/components/ui/stars';
import { HOME_REVIEWS } from '@/lib/reviews';

export function HomeReviews() {
  return (
    <section aria-labelledby="home-reviews" className="mx-auto max-w-[1360px] px-5 pb-24 lg:px-8">
      <SectionHeading
        id="home-reviews"
        title="What people say after a year of wear"
        aside="Sample reviews for this demo store"
      />
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {HOME_REVIEWS.map((r) => (
          <li key={r.author}>
            <figure className="bg-paper m-0 flex h-full flex-col gap-4 rounded p-7">
              <Stars rating={r.rating} />
              <blockquote className="m-0 text-[17px] leading-relaxed">{r.body}</blockquote>
              <figcaption className="mt-auto flex flex-col gap-0.5 text-sm">
                <span className="font-semibold">{r.author}</span>
                <span className="text-muted">{r.item}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
