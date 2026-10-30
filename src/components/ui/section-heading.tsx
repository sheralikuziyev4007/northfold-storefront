import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  title,
  action,
  aside,
  className,
}: {
  id?: string;
  title: string;
  action?: { href: string; label: string };
  aside?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-7 flex flex-wrap items-baseline justify-between gap-3', className)}>
      <h2 id={id} className="font-semiwide text-[28px] font-extrabold tracking-[-0.02em] sm:text-4xl">
        {title}
      </h2>
      {action ? (
        <Link href={action.href} className="text-[15px] font-semibold underline underline-offset-4">
          {action.label}
        </Link>
      ) : null}
      {aside ? <span className="text-muted text-sm">{aside}</span> : null}
    </div>
  );
}
