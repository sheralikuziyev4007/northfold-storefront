import Link from 'next/link';
import { footerNav } from '@/lib/navigation';
import { getCollectionLinks } from '@/lib/shop-nav';

/** Link to the developer's portfolio. Override with NEXT_PUBLIC_AUTHOR_URL (Upwork profile, personal site). */
const AUTHOR_URL = process.env.NEXT_PUBLIC_AUTHOR_URL || 'https://github.com/sheralikuziyev4007';

export async function Footer() {
  const groups = footerNav(await getCollectionLinks());
  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex max-w-[1360px] flex-wrap gap-x-16 gap-y-10 px-5 pt-14 pb-10 lg:px-8">
        <div className="flex flex-[2_1_260px] flex-col gap-3">
          <span className="font-wide text-[26px] font-extrabold">Northfold</span>
          <p className="text-muted max-w-[22rem] text-sm leading-relaxed">
            Small-run clothing in heavyweight natural fabrics.
          </p>
        </div>
        {groups.map((group) => (
          <nav
            key={group.title}
            aria-label={group.title}
            className="flex flex-[1_1_140px] flex-col gap-2.5 text-sm"
          >
            <span className="font-bold">{group.title}</span>
            {group.links.map((link) => (
              <Link key={link.href} href={link.href} className="no-underline hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="text-muted mx-auto flex max-w-[1360px] flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-5 pb-8 text-[13px] lg:px-8">
        <p>
          © 2026 Northfold. A portfolio project, not a real store. Product data comes from the Shopify
          Storefront API.
        </p>
        <p>
          Designed and built by{' '}
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-loden font-semibold underline underline-offset-2"
          >
            Sherali Kuziyev
          </a>
        </p>
      </div>
    </footer>
  );
}
