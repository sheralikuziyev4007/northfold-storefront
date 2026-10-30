import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import type { Collection } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

const TONES = ['bg-tone-charcoal text-paper', 'bg-tone-oat', 'bg-tone-slate'];

export function CollectionsGrid({ collections }: { collections: Collection[] }) {
  if (!collections.length) return null;
  const [first, ...rest] = collections.slice(0, 3);

  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="mx-auto max-w-[1360px] scroll-mt-24 px-5 pb-24 lg:px-8"
    >
      <SectionHeading id="collections-heading" title="Shop by collection" />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
        {[first!, ...rest].map((c, i) => (
          <li key={c.id} className={cn(i === 0 && 'md:row-span-2')}>
            <Link
              href={`/collections/${c.handle}`}
              className={cn(
                'group relative flex h-full items-end overflow-hidden rounded p-7 no-underline',
                i === 0 ? 'min-h-[360px] md:min-h-[520px]' : 'min-h-[220px] md:min-h-[252px]',
                c.image ? 'bg-tone-charcoal text-paper' : TONES[i % TONES.length],
              )}
            >
              {c.image ? (
                <>
                  <Image
                    src={c.image.url}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Scrim keeps the title legible over any photo. */}
                  <span
                    aria-hidden="true"
                    className="from-ink/70 absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t to-transparent"
                  />
                </>
              ) : null}
              <span className="relative flex flex-col gap-1.5">
                <span className="font-semiwide text-[30px] font-extrabold">{c.title}</span>
                {c.description ? <span className="text-[15px] opacity-85">{c.description}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
