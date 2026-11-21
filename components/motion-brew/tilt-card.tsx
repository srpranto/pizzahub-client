"use client";

/**
 * TiltCard, from https://motion-brew.com/components/tilt-card
 *
 * One self contained file: the component and the cn()
 * helper. Needs React 18 or 19 and Tailwind CSS v4.
 */

import * as React from "react";
import { type HTMLMotionProps, motion, type SpringOptions, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

// TiltCard

/**
 * TiltCard
 *
 * Trigger: hover. The card tilts in 3D toward the cursor on a spring, lifts a
 * touch, and a glare highlight slides across the surface opposite the tilt.
 * Leaving the card settles it flat. Touch and reduced-motion users get a flat card.
 *
 * Engine: motion/react (motion values + springs, no re-renders on move).
 */

const DEFAULT_SPRING: SpringOptions = { stiffness: 260, damping: 22, mass: 0.7 };

export interface TiltCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  /** Largest tilt on each axis, in degrees. Default `12`. */
  maxTilt?: number;
  /** Scale while hovered. Default `1.03`. */
  hoverScale?: number;
  /** Show the moving glare highlight. Default `true`. */
  glare?: boolean;
  /** Peak glare opacity, 0 to 1. Default `0.35`. */
  glareOpacity?: number;
  /** Camera distance for the 3D effect, in px. Lower is more dramatic. Default `800`. */
  perspective?: number;
  /** Spring for tilt and settle. Default `{ stiffness: 260, damping: 22, mass: 0.7 }`. */
  spring?: SpringOptions;
}

export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(function TiltCard(
  {
    children,
    className,
    maxTilt = 12,
    hoverScale = 1.03,
    glare = true,
    glareOpacity = 0.35,
    perspective = 800,
    spring = DEFAULT_SPRING,
    style,
    onPointerMove,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const reduceMotion = useReducedMotion();

  // Pointer position as 0..1 across the card. 0.5 is the center.
  const nx = useMotionValue(0.5);
  const ny = useMotionValue(0.5);
  const hover = useSpring(0, spring);

  const rotateX = useSpring(useTransform(ny, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(nx, [0, 1], [-maxTilt, maxTilt]), spring);
  const scale = useTransform(hover, [0, 1], [1, hoverScale]);

  const glareX = useTransform(nx, [0, 1], [100, 0]);
  const glareY = useTransform(ny, [0, 1], [100, 0]);
  const glareAlpha = useTransform(hover, [0, 1], [0, glareOpacity]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareAlpha}), transparent 60%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    nx.set((event.clientX - rect.left) / rect.width);
    ny.set((event.clientY - rect.top) / rect.height);
    hover.set(1);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    nx.set(0.5);
    ny.set(0.5);
    hover.set(0);
  };

  return (
    <div style={{ perspective }} className="w-full block min-w-0">
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", ...style }}
        className={cn(
          "relative w-full overflow-hidden rounded-3xl bg-card shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] will-change-transform motion-reduce:transform-none",
          className,
        )}
        {...props}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay motion-reduce:hidden"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
});