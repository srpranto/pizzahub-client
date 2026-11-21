import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CategoryMeta {
  title: string;
  description: string;
  image: string;
}

const CATEGORY_ITEMS: readonly CategoryMeta[] = [
  {
    title: "Classic Pizzas",
    description: "Margherita, Pepperoni, and timeless recipes with stone-baked crust",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Vegetarian Pizzas",
    description: "Farm-fresh peppers, artichokes, mushrooms, and plant-based indulgence",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Meat Lovers",
    description: "Loaded prosciutto, artisanal sausage, smoked pancetta, and cured salami",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Specialty / Gourmet Pizzas",
    description: "White truffle cream, hot honey drizzles, figs, and gourmet buffalo mozzarella",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Sides & Appetizers",
    description: "Crispy garlic knots, burrata caprese salad, and wood-fired focaccia",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Beverages & Desserts",
    description: "Homemade espresso tiramisu, Italian cannoli, and craft sodas",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop",
  },
];

export function Categories() {
  return (
    <section className="py-16 sm:py-24 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Curated Menus
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-1">
            Browse By Category
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            From centuries-old Neapolitan classics to modern culinary innovations, discover hand-stretched pies baked to order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_ITEMS.map((cat) => (
            <Link
              key={cat.title}
              href={`/menu?category=${encodeURIComponent(cat.title)}`}
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[260px] sm:h-[280px] ring-1 ring-black/5 dark:ring-white/10 block w-full focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

              <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary shadow-sm">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div className="relative z-10 p-6 space-y-1.5 text-white">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Artisanal Selection
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 [text-wrap:pretty]">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
