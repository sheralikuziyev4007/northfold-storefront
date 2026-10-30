'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState error={error} reset={reset} title="This product didn’t load" />;
}
