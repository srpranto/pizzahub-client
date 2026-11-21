"use client";

import Image from "next/image";
import { ArrowRight, Flame, Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurText } from "@/components/motion-brew/blur-text";
import { HighlightText } from "@/components/motion-brew/highlight-text";
import { TiltCard } from "@/components/motion-brew/tilt-card";
import { MagneticButton } from "@/components/motion-brew/magnetic-button";

export function Hero() {
  return (
    <section className="relative overflow-hidden ambient-glow bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="accent" className="gap-1.5 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              <Flame className="h-3.5 w-3.5" />
              Handcrafted &amp; Stone-Fired
            </Badge>

            <BlurText
              as="h1"
              text="Real Artisanal Pizza, Baked by Master Pizzaiolos"
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.1] [text-wrap:balance]"
              stagger={0.06}
              duration={0.6}
            />

            <HighlightText
              text="Discover authentic stone-baked pizzas crafted by independent kitchens in your area. 48-hour fermented sourdough, San Marzano tomatoes, and fresh mozzarella delivered hot to your door."
              highlights={["independent kitchens", "48-hour fermented sourdough", "delivered hot to your door"]}
              color="rgba(230, 126, 34, 0.16)"
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl [text-wrap:pretty]"
            />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                href="/menu"
                variant="primary"
                strength={0.25}
                labelStrength={0.12}
                className="h-12 px-8 text-base rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors"
              >
                <span>Explore The Menu</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                href="/sign-up?role=vendor"
                variant="outline"
                strength={0.25}
                labelStrength={0.12}
                className="h-12 px-6 text-base rounded-xl font-bold border-2 border-border/80 bg-card text-foreground hover:bg-muted hover:border-foreground/30 shadow-xs transition-all"
              >
                <span>Join As A Vendor</span>
              </MagneticButton>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground tabular-nums">800°F</p>
                  <p className="text-xs text-muted-foreground">Wood Fired</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground tabular-nums">4.9 / 5</p>
                  <p className="text-xs text-muted-foreground">Top Rated</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground tabular-nums">100%</p>
                  <p className="text-xs text-muted-foreground">Artisanal</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <TiltCard
              maxTilt={8}
              hoverScale={1.02}
              glare={true}
              glareOpacity={0.25}
              className="relative mx-auto aspect-4/3 w-full max-w-lg lg:max-w-none overflow-hidden rounded-3xl border-4 border-card shadow-2xl ring-1 ring-black/10 dark:ring-white/10 group"
            >
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop"
                alt="Stone baked pepperoni pizza with fresh basil"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/85 p-4 backdrop-blur-md border border-border/80 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Chef&apos;s Signature
                    </span>
                    <h4 className="text-base font-bold text-foreground line-clamp-1">
                      Neapolitan Margherita &amp; Truffle
                    </h4>
                  </div>
                  <span className="shrink-0 rounded-lg bg-primary px-3 py-1 font-bold text-primary-foreground text-sm tabular-nums shadow-xs">
                    $18.50
                  </span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
