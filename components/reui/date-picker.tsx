"use client";

import * as React from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  min?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  value = "",
  onChange,
  min,
  disabled = false,
  className,
  placeholder = "Select delivery date",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      // Parse YYYY-MM-DD
      const parsed = parseISO(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }, [value]);

  const minDate = React.useMemo(() => {
    if (!min) return startOfToday();
    try {
      const parsed = parseISO(min);
      return isNaN(parsed.getTime()) ? startOfToday() : parsed;
    } catch {
      return startOfToday();
    }
  }, [min]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      onChange(formatted);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full h-11 justify-between text-left font-normal border-input bg-background hover:bg-muted/60 transition-colors rounded-xl px-3.5",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2.5 truncate">
            <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
            <span className={cn("truncate text-sm", selectedDate && "font-semibold text-foreground")}>
              {selectedDate ? format(selectedDate, "PPP") : placeholder}
            </span>
          </span>
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider shrink-0 ml-2">
            Change
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border bg-card" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) => date < minDate}
        />
      </PopoverContent>
    </Popover>
  );
}
