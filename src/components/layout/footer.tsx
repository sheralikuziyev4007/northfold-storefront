import Link from 'next/link';
import { FOOTER_NAV } from '@/lib/navigation';

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex max-w-[1360px] flex-wrap gap-x-16 gap-y-10 px-5 pt-14 pb-10 lg:px-8">
        <div className="flex flex-[2_1_260px] flex-col gap-3">
          <span className="font-wide text-[26px] font-extrabold">Northfold</span>
          <p className="text-muted max-w-[22rem] text-sm leading-relaxed">
            Small-run clothing in heavyweight natural fabrics.
          </p>
        </div>
        {FOOTER_NAV.map((group) => (
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
      <p className="text-muted mx-auto max-w-[1360px] px-5 pb-8 text-[13px] lg:px-8">
        © 2026 Northfold. A portfolio project, not a real store. Product data comes from the Shopify
        Storefront API.
      </p>
    </footer>
  );
}
