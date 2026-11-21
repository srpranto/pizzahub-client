import { Award, Clock, HeartHandshake, Utensils } from "lucide-react";

const FEATURES = [
  {
    icon: Utensils,
    title: "100% Handcrafted Ferment",
    description: "Every pizza begins with natural sourdough fermented for 48+ hours, creating unmatched airy crusts and digestible perfection.",
  },
  {
    icon: Award,
    title: "Vetted Kitchens Only",
    description: "We hand-inspect kitchen sanitation, stone oven temperatures, and raw ingredients before approving any vendor.",
  },
  {
    icon: Clock,
    title: "Scheduled Delivery",
    description: "Pick the exact date you want your pie delivered. Freshly fired and boxed minutes before arriving at your door.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Artisan Support",
    description: "Empower independent pizzaiolos and family pizzerias in your community with fair commission and transparent pricing.",
  },
];

export function WhyUs() {
  return (
    <section suppressHydrationWarning className="py-16 sm:py-24 bg-card/60 border-y border-border">
      <div suppressHydrationWarning className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            The PizzaHub Standard
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-1">
            Why Discerning Pizza Lovers Choose Us
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We are not another mass-production chain aggregator. We are a specialized collective for artisanal pizza culture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative flex flex-col items-center text-center p-7 rounded-2xl bg-card border border-border/80 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/40 overflow-hidden w-full min-w-0"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed [text-wrap:pretty]">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
