import Link from "next/link";
import { Pizza, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center ambient-glow overflow-hidden">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 shadow-xs">
        <Pizza className="h-10 w-10 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-3">
        404 - Pizza Not Found
      </h1>
      <p className="max-w-md text-base text-muted-foreground mb-8 leading-relaxed">
        We searched all our brick ovens, but this slice seems to have vanished. Check the URL or browse our freshly baked menu.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/menu">Browse All Pizzas</Link>
        </Button>
      </div>
    </div>
  );
}
