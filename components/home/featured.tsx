import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/menu/menu-card";
import type { MenuItem } from "@/types";

interface FeaturedProps {
  items: MenuItem[];
}

export function Featured({ items }: FeaturedProps) {
  // Present at least 6 real database-driven approved items as required
  const displayItems = items.length >= 6 ? items.slice(0, 6) : items;

  return (
    <section suppressHydrationWarning className="py-10 sm:py-24">
      <div suppressHydrationWarning className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Handpicked From Vetted Kitchens</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Artisanal Pies
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl [text-wrap:pretty]">
              Stone-fired pizzas baked by independent neighborhood pizzerias. Slow 48-hour fermented sourdough, San Marzano tomato sauce, and fresh mozzarella delivered hot to your door.
            </p>
          </div>

          <Button variant="outline" asChild size="sm" className="w-fit group h-9 sm:h-10 text-xs sm:text-sm">
            <Link href="/menu">
              Explore All Stone-Baked Pies
              <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {displayItems.length > 0 ? (
          <div suppressHydrationWarning className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/40">
            <p className="text-sm text-muted-foreground">
              New artisanal kitchens are firing up their brick ovens. Check back shortly!
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/menu">Browse Complete Catalog</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
