import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Title & subtitle skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
      </div>

      {/* Filter card skeleton */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xs mb-8">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      </div>

      {/* Item count text skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-40 rounded" />
      </div>

      {/* 8-card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-xs"
          >
            <div>
              <Skeleton className="aspect-4/3 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-md mt-2" />
              </div>
            </div>
            <div className="p-5 pt-0">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
