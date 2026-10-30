import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The brand's signature surface: a white woven label with a stitched inner border.
 * Used for product facts, brand commitments and the 404 page.
 */
export function CareLabel({
  children,
  className,
  innerClassName,
  tilt,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tilt?: boolean;
}) {
  return (
    <div className={cn('bg-paper text-ink p-2', tilt && 'shadow-lift -rotate-[4deg]', className)}>
      <div className={cn('border-stitch border-[1.5px] border-dashed', innerClassName)}>{children}</div>
    </div>
  );
}
