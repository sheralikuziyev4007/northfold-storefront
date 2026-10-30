'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/ui-store';
import { CloseIcon } from './icons';

export function Toaster() {
  const toast = useUIStore((s) => s.toast);
  const dismiss = useUIStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismiss, 6000);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:justify-end"
    >
      {toast ? (
        <div
          role="alert"
          key={toast.id}
          className="bg-ink text-paper shadow-lift pointer-events-auto flex w-full max-w-[460px] items-center gap-3.5 rounded-md px-4.5 py-4"
        >
          <span className="flex-1 text-[15px] leading-snug">{toast.message}</span>
          {toast.action ? (
            <button
              type="button"
              onClick={() => {
                toast.action?.onAction();
                dismiss();
              }}
              className="bg-paper text-ink h-10 rounded px-3.5 text-sm font-semibold"
            >
              {toast.action.label}
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="grid size-9 place-items-center"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
