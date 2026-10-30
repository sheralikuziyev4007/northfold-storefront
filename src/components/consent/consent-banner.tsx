'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CONSENT_KEY, readConsent, type Consent } from '@/lib/analytics';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function ConsentBanner() {
  const [consent, setConsent] = useState<Consent | null | 'unknown'>('unknown');

  useEffect(() => setConsent(readConsent()), []);

  function decide(value: Consent) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* Storage can be blocked; the choice then lasts for this page view. */
    }
    setConsent(value);
  }

  return (
    <>
      {consent === 'granted' && GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}

      {consent === null ? (
        <section
          aria-label="Cookie consent"
          className="border-line bg-paper shadow-lift fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-[760px] flex-wrap items-center gap-5 rounded-md border p-5 sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
            <h2 className="text-base font-bold">Help us improve the store</h2>
            <p className="text-muted text-sm leading-relaxed">
              We measure which pages you view and what you add to your cart. Analytics stay off until you
              accept.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => decide('denied')}>
              Decline
            </Button>
            <Button onClick={() => decide('granted')}>Accept analytics</Button>
          </div>
        </section>
      ) : null}
    </>
  );
}
