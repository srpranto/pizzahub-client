"use client";

/**
 * ShimmerText, from https://motion-brew.com/components/shimmer-text
 *
 * One self contained file: the component and the cn()
 * helper. Needs React 18 or 19 and Tailwind CSS v4.
 */

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ShimmerText

/**
 * ShimmerText
 *
 * Trigger: timeline. A bright band sweeps across muted text on a loop, the
 * "thinking" sheen used for AI and loading states. The text stays real. Reduced
 * motion shows it plain.
 *
 * Engine: motion/react (a looping background-position sweep on clipped text).
 */

export interface ShimmerTextProps {
  /** The text. Default `"Thinking…"`. */
  text?: string;
  /** Element to render. Default `"span"`. */
  as?: "p" | "span" | "h3";
  /** Seconds per sweep. Default `1.8`. */
  duration?: number;
  /** Width of the bright band, as a percent of the text. Default `14`. */
  spread?: number;
  className?: string;
}

export const ShimmerText = React.forwardRef<HTMLElement, ShimmerTextProps>(function ShimmerText(
  { text = "Thinking…", as = "span", duration = 1.8, spread = 14, className },
  ref,
) {
  const Tag = motion[as];
  const a = 50 - spread / 2;
  const b = 50 + spread / 2;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(
        "inline-block bg-clip-text text-transparent [--shimmer-base:#a1a1aa] [--shimmer-shine:#18181b] dark:[--shimmer-base:#71717a] dark:[--shimmer-shine:#fafafa] motion-reduce:text-zinc-500 motion-reduce:bg-none",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, var(--shimmer-base) 0%, var(--shimmer-base) ${a}%, var(--shimmer-shine) 50%, var(--shimmer-base) ${b}%, var(--shimmer-base) 100%)`,
        backgroundSize: "250% 100%",
      }}
      animate={{ backgroundPosition: ["100% 0%", "-50% 0%"] }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {text}
    </Tag>
  );
});

