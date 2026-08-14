"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

export default function CalendarBasic() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 6, 25));

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="w-fit rounded-lg border bg-input"
    />
  );
}
