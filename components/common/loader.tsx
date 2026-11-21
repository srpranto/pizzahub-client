import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loader({
  className,
  size = "md",
  text = "Loading...",
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-muted-foreground",
        className
      )}
    >
      <Loader2
        className={cn("animate-spin text-primary mb-3", sizeClasses[size])}
      />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
}
