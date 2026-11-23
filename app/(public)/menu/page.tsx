import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, UtensilsCrossed, Flame } from "lucide-react";
import { MenuFilters } from "@/components/menu/menu-filters";
import { MenuCard } from "@/components/menu/menu-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyBox } from "@/components/common/empty-box";
import { getPublicMenuItems } from "@/lib/menu-service";

interface MenuPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl sm:rounded-2xl border border-border p-2.5 sm:p-4 space-y-3 sm:space-y-4">
          <Skeleton className="aspect-4/3 w-full rounded-lg sm:rounded-xl" />
          <Skeleton className="h-4 sm:h-5 w-3/4" />
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-8 sm:h-10 w-full rounded-md sm:rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default async function BrowseMenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const result = await getPublicMenuItems(resolvedParams);

  const currentPage = result.page || 1;
  const totalPages = result.totalPages || 1;

  const buildPageUrl = (targetPage: number) => {
    const p = new URLSearchParams();
    if (resolvedParams.search) p.set("search", resolvedParams.search);
    if (resolvedParams.category) p.set("category", resolvedParams.category);
    if (resolvedParams.location) p.set("location", resolvedParams.location);
    if (resolvedParams.sort) p.set("sort", resolvedParams.sort);
    p.set("page", String(targetPage));
    return `/menu?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-10 pb-24 sm:pb-16 w-full min-w-0 overflow-x-hidden">
      <div className="relative mb-5 sm:mb-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-linear-to-b from-card via-card/90 to-background p-4 sm:p-8 shadow-xs overflow-hidden ambient-glow w-full">
        <div className="relative z-10 max-w-2xl space-y-1.5 sm:space-y-2.5">
          <Badge variant="accent" className="gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">
            <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Stone-Oven Collection
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground [text-wrap:balance]">
            Browse Artisanal Pizzas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
            Discover master-crafted pies baked in 800°F brick ovens by certified local pizzaiolos. Filter by artisanal category, kitchen location, or price.
          </p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-24 w-full rounded-2xl" />}>
        <MenuFilters />
      </Suspense>

      <div className="mt-4 sm:mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground tabular-nums">{result.data.length}</strong> of{" "}
          <strong className="text-foreground tabular-nums">{result.total}</strong> approved pies
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-foreground tabular-nums">{currentPage}</strong> of{" "}
            <strong className="text-foreground tabular-nums">{totalPages}</strong>
          </span>
        )}
      </div>

      <Suspense fallback={<MenuGridSkeleton />}>
        {result.data.length > 0 ? (
          <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6 w-full min-w-0 max-w-full">
            {result.data.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyBox
              title="No Pizzas Match Your Search"
              description="Try broadening your category or location filters to see more delicious stone-baked options."
              icon={<UtensilsCrossed className="h-8 w-8 text-primary" />}
              action={
                <Button asChild variant="outline">
                  <Link href="/menu">Reset Filters</Link>
                </Button>
              }
            />
          </div>
        )}
      </Suspense>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2 border-t border-border pt-6">
          {currentPage <= 1 ? (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={buildPageUrl(currentPage - 1)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Link>
            </Button>
          )}

          <span className="px-4 text-xs font-medium text-muted-foreground">
            {currentPage} / {totalPages}
          </span>

          {currentPage >= totalPages ? (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={buildPageUrl(currentPage + 1)}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
