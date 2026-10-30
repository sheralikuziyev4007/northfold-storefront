import { ProductGridSkeleton, Skeleton } from '@/components/ui/skeleton';

export default function CollectionLoading() {
  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-6 pb-24 lg:px-8 lg:pt-8">
      <Skeleton className="mb-3.5 h-4 w-32" />
      <Skeleton className="mb-3 h-16 w-72" />
      <Skeleton className="mb-8 h-4 w-28" />
      <div className="flex gap-10">
        <div className="hidden w-[260px] flex-none flex-col gap-4 lg:flex">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
