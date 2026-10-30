'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { Sheet } from '@/components/ui/sheet';
import { MAIN_NAV } from '@/lib/navigation';
import { useUIStore } from '@/lib/stores/ui-store';
import { CountryList } from './country-selector';

export function MobileMenu() {
  const open = useUIStore((s) => s.menuOpen);
  const openMenu = useUIStore((s) => s.openMenu);
  const close = useUIStore((s) => s.closeMenu);
  const pathname = usePathname();

  useEffect(() => close(), [pathname, close]);

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-label="Open menu"
        className="grid size-11 place-items-center lg:hidden"
      >
        <MenuIcon />
      </button>
      <Sheet open={open} onClose={close} label="Menu" placement="left">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="border-line flex items-center justify-between border-b py-2 pr-2 pl-5">
            <span className="font-wide text-[22px] font-extrabold">Northfold</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-11 place-items-center"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          <nav aria-label="Main" className="flex flex-col px-5 py-4">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="font-semiwide border-line-soft aria-[current=page]:text-loden border-b py-4 text-2xl font-extrabold no-underline"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/wishlist" className="py-4 text-lg font-semibold no-underline">
              Wishlist
            </Link>
          </nav>
          <div className="border-line mt-auto border-t px-3 py-4">
            <p className="px-3 pb-2 text-sm font-bold">Shipping to</p>
            <CountryList onPicked={close} />
          </div>
        </div>
      </Sheet>
    </>
  );
}
