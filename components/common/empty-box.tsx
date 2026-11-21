import * as React from "react";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyBoxProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyBox({
  title = "No items found",
  description = "There are no records to display at this moment.",
  icon,
  action,
  className,
}: EmptyBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/50",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        {icon ?? <UtensilsCrossed className="h-8 w-8 text-primary/70" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
