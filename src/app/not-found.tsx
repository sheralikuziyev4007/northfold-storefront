import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { CareLabel } from '@/components/ui/care-label';

const POPULAR = [
  { href: '/', label: 'Home' },
  { href: '/collections/all', label: 'New in' },
  { href: '/collections/outerwear', label: 'Outerwear' },
  { href: '/journal', label: 'Journal' },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-14 px-5 pt-14 pb-24 lg:px-8 lg:pt-[72px]">
      <div className="flex flex-[1_1_480px] flex-col gap-6">
        <p className="text-muted text-[15px]">Error 404</p>
        <h1 className="font-wide text-[44px] leading-[0.95] font-extrabold tracking-[-0.035em] sm:text-[clamp(44px,5.6vw,84px)]">
          We can’t find that page.
        </h1>
        <p className="text-muted max-w-[34rem] text-lg leading-normal">
          The link may be out of date, or the product may have finished its run. Search for it, or start from
          one of these pages.
        </p>
        <form action="/search" role="search" className="flex max-w-[520px] flex-wrap items-end gap-2.5">
          <div className="flex flex-[1_1_260px] flex-col gap-1.5">
            <label htmlFor="nf-q" className="text-sm font-semibold">
              Search the store
            </label>
            <input
              id="nf-q"
              name="q"
              type="search"
              placeholder="Hoodie, chore jacket, beanie…"
              className="border-ink bg-paper h-[52px] rounded-md border-[1.5px] px-4 text-base"
            />
          </div>
          <button type="submit" className={buttonClasses('primary', 'lg', 'h-[52px]')}>
            Search
          </button>
        </form>
        <nav aria-label="Popular pages" className="flex flex-wrap gap-2.5">
          {POPULAR.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="border-line bg-paper hover:border-ink inline-flex h-10 items-center rounded-full border px-4 text-sm no-underline"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
      <div aria-hidden="true" className="grid min-h-[360px] flex-[1_1_380px] place-items-center">
        <CareLabel
          className="shadow-lift w-[300px] -rotate-[5deg]"
          innerClassName="flex flex-col gap-3.5 px-6 py-7"
        >
          <span className="font-wide text-[22px] font-extrabold">Northfold</span>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted">Page</dt>
            <dd className="font-semibold">Not found</dd>
            <dt className="text-muted">Size</dt>
            <dd className="font-semibold">404</dd>
            <dt className="text-muted">Care</dt>
            <dd className="font-semibold">Check the link</dd>
          </dl>
        </CareLabel>
      </div>
    </div>
  );
}
