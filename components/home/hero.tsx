"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Flame, Star, ShieldCheck, UtensilsCrossed, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurText } from "@/components/motion-brew/blur-text";
import { HighlightText } from "@/components/motion-brew/highlight-text";
import { TiltCard } from "@/components/motion-brew/tilt-card";
import { MagneticButton } from "@/components/motion-brew/magnetic-button";
import { useSession } from "@/lib/auth-client";
import { BecomeVendorModal } from "./become-vendor-modal";

export function Hero() {
  const { data: session } = useSession();
  const [vendorModalOpen, setVendorModalOpen] = React.useState(false);

  const user = session?.user;
  const role = (user as { role?: string })?.role || (session ? "customer" : null);

  return (
    <section className="relative overflow-hidden ambient-glow bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Copy & Actions */}
          <div className="space-y-6">
            <Badge variant="accent" className="gap-1.5 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              <Flame className="h-3.5 w-3.5" />
              Handcrafted &amp; Stone-Fired
            </Badge>

            <BlurText
              as="h1"
              text="Crafted From The Crust Up"
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.1] [text-wrap:balance]"
              stagger={0.06}
              duration={0.6}
              trigger="mount"
            />

            <HighlightText
              text="Every ingredient sourced directly from artisan growers. Zero additives, pure sourdough perfection."
              highlights={["artisan growers", "Zero additives", "pure sourdough perfection"]}
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
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </MagneticButton>

              {role === "vendor" ? (
                <MagneticButton
                  href="/dashboard/vendor"
                  variant="outline"
                  strength={0.25}
                  labelStrength={0.12}
                  className="h-12 px-6 text-base rounded-xl font-bold border-2 border-border/80 bg-card text-foreground hover:bg-muted hover:border-foreground/30 shadow-xs transition-all gap-2"
                >
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                  <span>Kitchen Hub</span>
                </MagneticButton>
              ) : role === "admin" ? (
                <MagneticButton
                  href="/dashboard/admin"
                  variant="outline"
                  strength={0.25}
                  labelStrength={0.12}
                  className="h-12 px-6 text-base rounded-xl font-bold border-2 border-border/80 bg-card text-foreground hover:bg-muted hover:border-foreground/30 shadow-xs transition-all gap-2"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Admin Console</span>
                </MagneticButton>
              ) : role === "customer" ? (
                <MagneticButton
                  onClick={() => setVendorModalOpen(true)}
                  variant="outline"
                  strength={0.25}
                  labelStrength={0.12}
                  className="h-12 px-6 text-base rounded-xl font-bold border-2 border-border/80 bg-card text-foreground hover:bg-muted hover:border-foreground/30 shadow-xs transition-all cursor-pointer"
                >
                  <span>Join As A Vendor</span>
                </MagneticButton>
              ) : (
                <MagneticButton
                  href="/sign-up?role=vendor"
                  variant="outline"
                  strength={0.25}
                  labelStrength={0.12}
                  className="h-12 px-6 text-base rounded-xl font-bold border-2 border-border/80 bg-card text-foreground hover:bg-muted hover:border-foreground/30 shadow-xs transition-all"
                >
                  <span>Join As A Vendor</span>
                </MagneticButton>
              )}
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

          {/* Right Column: Option 2 Cinematic 3D Levitating Craft Card */}
          <div>
            <TiltCard
              maxTilt={8}
              hoverScale={1.02}
              glare={true}
              glareOpacity={0.25}
              className="relative mx-auto aspect-4/3 w-full max-w-lg lg:max-w-none overflow-hidden rounded-3xl border-4 border-card shadow-2xl ring-1 ring-black/10 dark:ring-white/10 group"
            >
              <Image
                src="/images/hero-banner.jpg"
                alt="Cinematic 3D levitating stone-baked pizza with fresh flying San Marzano tomatoes, buffalo mozzarella and basil"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/20 to-transparent" />

              {/* Floating Live Kitchen Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-foreground border border-border/80 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Hearth Fired at 900°F</span>
              </div>

              {/* Bottom Signature Overlay */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 dark:bg-card/90 p-4 sm:p-5 backdrop-blur-md border border-border/80 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest">
                      Chef&apos;s Signature
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-foreground line-clamp-1">
                      Artisanal Burrata &amp; San Marzano Special
                    </h4>
                    <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
                      48h Ferment • Buffalo Mozzarella • Fresh Basil DOP
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block rounded-xl bg-primary px-3.5 py-1.5 font-black text-primary-foreground text-base tabular-nums shadow-sm">
                      $19.50
                    </span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>

      <BecomeVendorModal
        open={vendorModalOpen}
        onOpenChange={setVendorModalOpen}
        userEmail={user?.email || undefined}
      />
    </section>
  );
}
