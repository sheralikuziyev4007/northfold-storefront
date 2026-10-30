'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainNavLinks({ items }: { items: readonly { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden flex-1 lg:block">
      <ul className="flex flex-wrap gap-7 text-[15px]">
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="hover:text-loden no-underline aria-[current=page]:font-bold"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
