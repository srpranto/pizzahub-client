import { Hero } from "@/components/home/hero";
import { Featured } from "@/components/home/featured";
import { Categories } from "@/components/home/categories";
import { WhyUs } from "@/components/home/why-us";
import { HowItWorks } from "@/components/home/how-it-works";
import { getFeaturedMenuItems } from "@/lib/menu-service";

export default async function HomePage() {
  const items = await getFeaturedMenuItems(8);

  return (
    <div suppressHydrationWarning className="flex flex-col">
      <Hero />
      <Featured items={items} />
      <Categories />
      <WhyUs />
      <HowItWorks />
    </div>
  );
}
