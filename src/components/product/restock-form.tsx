'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';

/** Back-in-stock sign-up. This demo validates the address but does not send email. */
export function RestockForm({ label }: { label: string }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'invalid' | 'done'>('idle');

  if (state === 'done') {
    return (
      <p role="status" className="bg-loden-tint rounded px-4 py-3 text-sm">
        Saved. This demo store doesn’t send emails, so no message will arrive.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'done' : 'invalid');
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor={id} className="text-sm font-semibold">
        Email me when {label} is back
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={id}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'invalid') setState('idle');
          }}
          aria-invalid={state === 'invalid'}
          aria-describedby={state === 'invalid' ? `${id}-error` : undefined}
          placeholder="you@example.com"
          className="border-ink bg-paper h-12 min-w-[200px] flex-1 rounded-md border-[1.5px] px-3.5 text-base"
        />
        <Button type="submit">Notify me</Button>
      </div>
      {state === 'invalid' ? (
        <p id={`${id}-error`} className="text-danger text-sm">
          Enter an email address like name@example.com.
        </p>
      ) : null}
    </form>
  );
}
