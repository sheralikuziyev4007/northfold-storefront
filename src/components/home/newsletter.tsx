'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'invalid' | 'done'>('idle');

  return (
    <section className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-8 px-5 py-24 lg:px-8">
      <div className="flex flex-[1_1_380px] flex-col gap-2.5">
        <h2 className="font-semiwide text-[28px] font-extrabold tracking-[-0.02em] sm:text-4xl">
          Hear about new drops first
        </h2>
        <p className="text-muted text-base">One email when a new run goes live. No daily promos.</p>
      </div>
      {state === 'done' ? (
        <p role="status" className="bg-loden-tint flex-[1_1_440px] rounded px-5 py-4 text-[15px]">
          You’re on the list. This is a demo store, so no emails will be sent.
        </p>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'done' : 'invalid');
          }}
          className="flex flex-[1_1_440px] flex-wrap items-end gap-2.5"
        >
          <div className="flex flex-[1_1_260px] flex-col gap-1.5">
            <label htmlFor="newsletter-email" className="text-sm font-semibold">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === 'invalid') setState('idle');
              }}
              aria-invalid={state === 'invalid'}
              aria-describedby={state === 'invalid' ? 'newsletter-error' : undefined}
              placeholder="you@example.com"
              className="border-ink bg-paper h-[52px] rounded-md border-[1.5px] px-4 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-[52px]">
            Subscribe
          </Button>
          {state === 'invalid' ? (
            <p id="newsletter-error" className="text-danger basis-full text-sm">
              Enter an email address like name@example.com.
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
