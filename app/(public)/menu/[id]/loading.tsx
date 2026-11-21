import { Skeleton } from "@/components/ui/skeleton";

export default function ItemDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back button skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-36 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <Skeleton className="aspect-4/3 w-full rounded-3xl" />
            <div className="flex gap-3 overflow-x-auto pb-2">
              <Skeleton className="h-20 w-24 shrink-0 rounded-xl" />
              <Skeleton className="h-20 w-24 shrink-0 rounded-xl" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-2">
              <Skeleton className="h-6 w-44 rounded-md mb-3" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/6 rounded-md" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Form Skeleton */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
