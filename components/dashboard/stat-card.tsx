"use client";

import * as React from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  description?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function AnimatedCounter({ value }: { value: number }) {
  const [mounted, setMounted] = React.useState(false);
  const spring = useSpring(0, { stiffness: 75, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  React.useEffect(() => {
    setMounted(true);
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{mounted ? display : value.toLocaleString()}</motion.span>;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  prefix = "",
  suffix = "",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("shadow-xs border-border/80 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col justify-between bg-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex items-baseline gap-1 text-2xl font-black text-foreground tabular-nums tracking-tight">
          {prefix && <span>{prefix}</span>}
          <AnimatedCounter value={value} />
          {suffix && <span className="text-sm font-semibold">{suffix}</span>}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
