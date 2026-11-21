"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ItemGalleryProps {
  images: string[];
  itemName: string;
}

export function ItemGallery({ images, itemName }: ItemGalleryProps) {
  const safeImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
        ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeImage = safeImages[activeIndex] || safeImages[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border/80 bg-muted shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-shadow hover:shadow-xl">
        <Image
          src={activeImage}
          alt={itemName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                activeIndex === idx
                  ? "border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-background scale-[1.02] shadow-sm"
                  : "border-border/70 opacity-70 hover:opacity-100 hover:border-border"
              )}
            >
              <Image
                src={img}
                alt={`${itemName} preview ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
