import Link from "next/link";
import { ArrowLeft, MapPin, Sparkles, Store, ShieldCheck, Flame, Clock } from "lucide-react";
import { ItemGallery } from "@/components/menu/item-gallery";
import { OrderForm } from "@/components/menu/order-form";
import { FavBtn } from "@/components/menu/fav-btn";
import { ReviewsSection } from "@/components/menu/reviews-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMenuItemById } from "@/lib/menu-service";

interface ItemDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuItemPage({ params }: ItemDetailsPageProps) {
  const { id } = await params;
  const item = await getMenuItemById(id);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-3">
          Pizza Not Found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This menu item may have been removed or is pending approval.
        </p>
        <Button asChild>
          <Link href="/menu">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse Menu
          </Link>
        </Button>
      </div>
    );
  }

  const isPremiumVendor = item.vendorPlan === "premium";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/menu"
          className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Browse Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative">
            <ItemGallery images={item.images} itemName={item.itemName} />
            <div className="absolute top-4 right-4 z-10">
              <FavBtn itemId={item.id} size="default" />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                {isPremiumVendor && (
                  <Badge variant="accent" className="gap-1 text-xs">
                    <Sparkles className="h-3 w-3" />
                    Premium Kitchen
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Approved Recipe
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {item.itemName}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  {item.location}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-2xl font-black text-primary tabular-nums tracking-tight">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-foreground mb-2">
                About This Creation
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {item.description}
              </p>
            </div>

            {/* Artisan Craft Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 text-center">
                <Flame className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">800°F Stone Oven</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Flash baked in 90s</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 text-center">
                <Clock className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">48h Sourdough</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Slow cold fermented</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 text-center">
                <Sparkles className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">D.O.P. Certified</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Italian ingredients</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    {item.vendorName || "Artisan Kitchen"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isPremiumVendor ? "Verified Premium Creator" : "Independent Pizza Maker"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <OrderForm item={item} />
          </div>
        </div>
      </div>

      <ReviewsSection
        itemId={item.id}
        vendorId={item.vendorId}
        itemName={item.itemName}
      />
    </div>
  );
}
