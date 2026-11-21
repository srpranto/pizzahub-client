"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-6">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-3">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-muted-foreground mb-2 leading-relaxed">
        {error.message || "An unexpected error occurred while processing your request."}
      </p>
      {error.digest && (
        <span className="text-xs text-muted-foreground/60 mb-6 font-mono">
          Digest: {error.digest}
        </span>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <Button onClick={reset} size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
