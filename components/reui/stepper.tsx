"use client";

import { Check, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface StepItem {
  title: string;
  description?: string;
  date?: string;
  status: "completed" | "current" | "upcoming" | "failed";
}

interface StepperProps {
  steps: StepItem[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        const getIcon = () => {
          switch (step.status) {
            case "completed":
              return <Check className="h-4 w-4 text-white" />;
            case "failed":
              return <X className="h-4 w-4 text-white" />;
            case "current":
              return <Clock className="h-4 w-4 text-white" />;
            default:
              return <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />;
          }
        };

        const getBadgeBg = () => {
          switch (step.status) {
            case "completed":
              return "bg-emerald-600";
            case "failed":
              return "bg-destructive";
            case "current":
              return "bg-primary animate-pulse";
            default:
              return "bg-muted border border-border";
          }
        };

        return (
          <div key={idx} className="relative flex items-start gap-4">
            {!isLast && (
              <div
                className={cn(
                  "absolute left-4 top-8 -bottom-6 w-0.5",
                  step.status === "completed"
                    ? "bg-emerald-600"
                    : step.status === "failed"
                    ? "bg-destructive"
                    : "bg-border"
                )}
              />
            )}

            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-xs",
                getBadgeBg()
              )}
            >
              {getIcon()}
            </div>

            <div className="flex-1 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="text-sm font-bold text-foreground">
                  {step.title}
                </h4>
                {step.date && !Number.isNaN(new Date(step.date).getTime()) && (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {format(new Date(step.date), "MMM d, yyyy, h:mm a")}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
