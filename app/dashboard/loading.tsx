import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-80 max-w-full rounded" />
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* Analytics Chart & Table Skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-3 w-64 rounded" />
          <Skeleton className="h-64 w-full rounded-xl mt-4" />
        </div>
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-3 w-52 rounded" />
          <div className="space-y-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
