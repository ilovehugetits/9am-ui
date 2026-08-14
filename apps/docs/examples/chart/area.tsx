"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const DATA = [
  { day: "Mon", sales: 4, returns: 1 },
  { day: "Tue", sales: 7, returns: 0 },
  { day: "Wed", sales: 5, returns: 2 },
  { day: "Thu", sales: 11, returns: 1 },
  { day: "Fri", sales: 14, returns: 3 },
  { day: "Sat", sales: 19, returns: 2 },
  { day: "Sun", sales: 12, returns: 1 },
];

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
  returns: { label: "Returns", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function ChartArea() {
  return (
    <ChartContainer config={config} className="h-[240px] w-full max-w-[560px]">
      <AreaChart data={DATA} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="sales"
          type="natural"
          stroke="var(--color-sales)"
          fill="var(--color-sales)"
          fillOpacity={0.2}
          stackId="a"
        />
        <Area
          dataKey="returns"
          type="natural"
          stroke="var(--color-returns)"
          fill="var(--color-returns)"
          fillOpacity={0.2}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
