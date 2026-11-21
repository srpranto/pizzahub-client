import Link from "next/link";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12 ambient-glow overflow-hidden">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card/95 backdrop-blur-sm p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-6">
          <XCircle className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-2 sm:text-3xl">
          Upgrade Checkout Cancelled
        </h1>

        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          No charges were made to your card. You can continue using your Free Starter plan (up to 3 items) and upgrade whenever you are ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/vendor/plan">
              <RotateCcw className="mr-2 h-4 w-4" />
              Review Plans
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/vendor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
