"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)}
      classNames={{
        root: cn(defaultClassNames.root, "w-fit"),
        months: cn(defaultClassNames.months, "flex flex-col sm:flex-row gap-4"),
        month: cn(defaultClassNames.month, "space-y-4"),
        month_caption: cn(
          defaultClassNames.month_caption,
          "flex justify-center pt-1 relative items-center mb-1"
        ),
        caption_label: cn(
          defaultClassNames.caption_label,
          "text-sm font-bold text-foreground capitalize"
        ),
        nav: cn(defaultClassNames.nav, "flex items-center gap-1"),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute right-1"
        ),
        month_grid: cn(defaultClassNames.month_grid, "w-full border-collapse space-y-1"),
        weekdays: cn(defaultClassNames.weekdays, "flex"),
        weekday: cn(
          defaultClassNames.weekday,
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
        ),
        week: cn(defaultClassNames.week, "flex w-full mt-2"),
        day: cn(
          defaultClassNames.day,
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
        ),
        selected: cn(
          "!bg-primary !text-primary-foreground font-bold hover:!bg-primary/90 focus:!bg-primary focus:!text-primary-foreground shadow-sm"
        ),
        today: cn(
          "bg-accent/15 text-accent font-extrabold ring-1 ring-accent rounded-xl"
        ),
        outside: cn(
          defaultClassNames.outside,
          "text-muted-foreground/30 opacity-40"
        ),
        disabled: cn(
          defaultClassNames.disabled,
          "text-muted-foreground/30 opacity-40 pointer-events-none"
        ),
        hidden: cn(defaultClassNames.hidden, "invisible"),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
