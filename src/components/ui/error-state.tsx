'use client';

import { useEffect } from 'react';
import { Button } from './button';
import { AlertIcon } from './icons';

export function ErrorState({
  error,
  reset,
  title = 'This page didn’t load',
  message = 'The store didn’t respond. Check your connection, then try again. Your cart is saved.',
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8">
      <div role="alert" className="bg-paper flex max-w-xl flex-col items-start gap-3 rounded px-8 py-10">
        <AlertIcon size={28} className="text-danger" />
        <h1 className="text-[22px] font-bold">{title}</h1>
        <p className="text-muted max-w-[44ch] text-[15px] leading-relaxed">{message}</p>
        <Button onClick={reset}>Try again</Button>
        {error.digest ? <p className="text-muted text-xs">Reference: {error.digest}</p> : null}
      </div>
    </div>
  );
}
