import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'success';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-md font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-loden disabled:bg-muted disabled:hover:bg-muted',
  secondary:
    'border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper disabled:border-line disabled:text-muted',
  ghost: 'text-ink underline underline-offset-4 hover:text-loden',
  inverse: 'bg-paper text-ink hover:bg-loden-tint',
  success: 'bg-loden text-paper',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-base',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

type IconButtonProps = ComponentProps<'button'> & { label: string };

export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'text-ink hover:bg-paper/70 relative grid size-11 place-items-center rounded-md',
        className,
      )}
      {...props}
    />
  );
}
