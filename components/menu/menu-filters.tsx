"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";

export function MenuFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "All";
  const currentLocation = searchParams.get("location") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";

  const [searchValue, setSearchValue] = React.useState(currentSearch);
  const [locationValue, setLocationValue] = React.useState(currentLocation);

  React.useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  React.useEffect(() => {
    setLocationValue(currentLocation);
  }, [currentLocation]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/menu?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", searchValue);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("location", locationValue);
  };

  const handleReset = () => {
    setSearchValue("");
    setLocationValue("");
    router.push("/menu");
  };

  const hasActiveFilters = Boolean(
    currentSearch ||
      (currentCategory && currentCategory !== "All") ||
      currentLocation ||
      currentSort !== "newest"
  );

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs w-full max-w-full min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>Filters &amp; Search</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground active:scale-[0.98]"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        <form onSubmit={handleSearchSubmit} className="relative w-full min-w-0">
          <Input
            placeholder="Search pizza name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pr-10 h-11 rounded-xl text-base sm:text-sm w-full"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="w-full min-w-0">
          <Select
            value={currentCategory}
            onValueChange={(val) => updateParam("category", val)}
          >
            <SelectTrigger className="h-11 rounded-xl text-base sm:text-sm w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleLocationSubmit} className="relative w-full min-w-0">
          <Input
            placeholder="Filter by city / area..."
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            className="pr-10 h-11 rounded-xl text-base sm:text-sm w-full"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Filter by location"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="w-full min-w-0">
          <Select
            value={currentSort}
            onValueChange={(val) => updateParam("sort", val)}
          >
            <SelectTrigger className="h-11 rounded-xl text-base sm:text-sm w-full">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Additions</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick-tap category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs w-full max-w-full scrollbar-none touch-pan-x min-w-0">
        {["All", ...CATEGORIES].map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => updateParam("category", cat)}
              className={`min-h-[38px] px-3.5 py-1.5 inline-flex items-center justify-center shrink-0 rounded-full font-semibold transition-all cursor-pointer border active:scale-[0.97] whitespace-nowrap ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              {cat === "All" ? "All Pizzas" : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
