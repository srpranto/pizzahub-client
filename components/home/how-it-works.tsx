import { Search, CalendarCheck, Pizza } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Select",
    description: "Explore dozens of artisanal creations from top independent kitchens with transparent reviews and ingredient lists.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Schedule Delivery",
    description: "Choose your preferred delivery date, add your delivery address, and include optional kitchen notes.",
  },
  {
    step: "03",
    icon: Pizza,
    title: "Fresh Oven Arrival",
    description: "Your local vendor fires the pie directly on hot stone, boxing it at peak crispness for immediate enjoyment.",
  },
];

export function HowItWorks() {
  return (
    <section suppressHydrationWarning className="py-16 sm:py-24">
      <div suppressHydrationWarning className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div suppressHydrationWarning className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-1">
            How PizzaHub Works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            From local dough bench to your dinner table in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative flex flex-col items-center">
                <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-accent/40 w-full h-full">
                  <div className="absolute top-4 right-4 text-xs font-black text-muted-foreground/50 font-mono tabular-nums px-2.5 py-0.5 rounded-md bg-muted/80 border border-border/40">
                    {s.step}
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed [text-wrap:pretty]">
                    {s.description}
                  </p>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-7 w-7 items-center justify-center rounded-full bg-background border border-border/90 text-primary text-xs shadow-sm font-bold pointer-events-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
