import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading product"
      className="mx-auto max-w-[1360px] px-5 pt-7 pb-24 lg:px-8"
    >
      <Skeleton className="mb-5 h-4 w-56" />
      <div className="flex flex-wrap gap-12">
        <Skeleton className="aspect-[4/5] min-w-0 flex-[999_1_560px] rounded" />
        <div className="flex max-w-[520px] flex-[1_1_380px] flex-col gap-5">
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-4 h-11 w-48" />
          <Skeleton className="h-[52px] w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
