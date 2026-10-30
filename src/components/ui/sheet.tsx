'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Placement = 'right' | 'left' | 'bottom' | 'top-center';

const placements: Record<Placement, string> = {
  right: 'ml-auto mr-0 h-dvh max-h-dvh w-full max-w-[440px] shadow-panel',
  left: 'mr-auto ml-0 h-dvh max-h-dvh w-full max-w-[360px]',
  bottom:
    'mb-0 mt-auto w-full max-w-none max-h-[calc(100dvh-56px)] rounded-t-[14px] sm:mx-auto sm:mb-auto sm:max-w-lg sm:rounded-[10px]',
  'top-center':
    'mx-auto mt-[12vh] w-[min(680px,calc(100%-40px))] rounded-lg shadow-[0_30px_60px_rgb(30_36_34/0.3)]',
};

/**
 * Modal surface built on the native <dialog>: focus trapping, Escape to close and inert
 * background come from the browser. Clicking the backdrop closes it.
 */
export function Sheet({
  open,
  onClose,
  label,
  placement = 'right',
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  placement?: Placement;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn('bg-stone text-ink m-0 overflow-hidden p-0', placements[placement], className)}
    >
      {open ? children : null}
    </dialog>
  );
}
