'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { setCountry } from '@/app/actions/market';
import { useMarket } from '@/components/market/market-context';
import { CheckIcon, GlobeIcon, SpinnerIcon } from '@/components/ui/icons';
import { MARKETS } from '@/lib/markets';
import { cn } from '@/lib/utils';

export function CountryList({ onPicked }: { onPicked?: () => void }) {
  const current = useMarket();
  const [pending, startTransition] = useTransition();
  const [picking, setPicking] = useState<string | null>(null);

  return (
    <ul className="flex flex-col">
      {MARKETS.map((m) => {
        const active = m.country === current.country;
        return (
          <li key={m.country}>
            <button
              type="button"
              aria-pressed={active}
              disabled={pending}
              onClick={() => {
                setPicking(m.country);
                startTransition(async () => {
                  await setCountry(m.country);
                  onPicked?.();
                });
              }}
              className={cn(
                'hover:bg-mist flex min-h-12 w-full items-center gap-3 rounded px-3 text-left text-[15px] disabled:cursor-wait',
                active && 'bg-mist',
              )}
            >
              <span className="flex-1">{m.name}</span>
              <span className="text-muted text-sm">
                {m.currency} {m.symbol}
              </span>
              <span className="grid w-[18px] place-items-center">
                {pending && picking === m.country ? (
                  <SpinnerIcon size={16} />
                ) : active ? (
                  <CheckIcon size={16} />
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function CountrySelector() {
  const market = useMarket();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'hover:bg-paper/70 flex h-11 items-center gap-1.5 rounded-md px-2.5 text-sm',
          open && 'bg-paper',
        )}
      >
        <GlobeIcon size={18} />
        <span className="sr-only">Country and currency: </span>
        {market.country} ({market.currency} {market.symbol})
      </button>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Choose country and currency"
          className="border-line bg-paper shadow-lift absolute top-[54px] right-0 z-40 w-[340px] rounded-md border p-2"
        >
          <div className="flex flex-col gap-1 px-3 pt-3 pb-2">
            <span className="text-base font-bold">Shipping to</span>
            <span className="text-muted text-[13px]">
              Prices, taxes and delivery times update for the country you pick.
            </span>
          </div>
          <CountryList onPicked={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
