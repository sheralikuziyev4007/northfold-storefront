'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function CollectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState error={error} reset={reset} title="Products didn’t load" />;
}
