"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const DATA = [
  { class: "Sports", stock: 12, sold: 9 },
  { class: "Super", stock: 4, sold: 6 },
  { class: "Muscle", stock: 8, sold: 3 },
  { class: "SUV", stock: 15, sold: 7 },
  { class: "Sedan", stock: 21, sold: 11 },
];

const config = {
  stock: { label: "In stock", color: "var(--chart-2)" },
  sold: { label: "Sold", color: "var(--chart-4)" },
} satisfies ChartConfig;

export default function ChartBar() {
  return (
    <ChartContainer config={config} className="h-[240px] w-full max-w-[560px]">
      <BarChart data={DATA}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="class" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="stock" fill="var(--color-stock)" radius={4} />
        <Bar dataKey="sold" fill="var(--color-sold)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
