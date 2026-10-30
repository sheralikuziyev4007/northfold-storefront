import Link from 'next/link';
import { CareLabel } from '@/components/ui/care-label';
import { cn } from '@/lib/utils';

const COMMITMENTS = [
  { title: 'Fibres', body: 'Organic cotton and recycled wool, listed by percentage on every product.' },
  { title: 'Origin', body: 'The workshop that sewed it, named on the product page.' },
  { title: 'Repairs', body: 'Torn seam or broken zip? Send it back and we fix it.' },
];

export function BrandStory() {
  return (
    <section className="bg-loden text-paper">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-12 px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-[1_1_420px] flex-col gap-5">
          <h2 className="font-wide text-[36px] leading-none font-extrabold tracking-[-0.03em] sm:text-[clamp(36px,4vw,56px)]">
            Fewer things, made to last.
          </h2>
          <p className="text-loden-tint max-w-[32rem] text-lg leading-relaxed">
            Every piece carries a label that tells you what it is made of, where it was sewn and how to keep
            it going.
          </p>
          <Link
            href="/journal/why-we-sew-in-small-runs"
            className="text-paper self-start font-semibold underline underline-offset-4"
          >
            Read how we make our clothes
          </Link>
        </div>
        <ul className="flex flex-[1_1_520px] flex-wrap gap-4">
          {COMMITMENTS.map((c, i) => (
            <li key={c.title} className={cn('flex-[1_1_160px]', i === 1 && 'sm:translate-y-[18px]')}>
              <CareLabel
                className="h-full"
                innerClassName="flex min-h-[130px] h-full flex-col gap-2 px-4 py-5"
              >
                <h3 className="text-base font-bold">{c.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{c.body}</p>
              </CareLabel>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
