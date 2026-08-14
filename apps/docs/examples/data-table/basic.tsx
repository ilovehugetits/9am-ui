"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

interface Sale {
  plate: string;
  model: string;
  buyer: string;
  price: number;
}

const SALES: Sale[] = [
  { plate: "46ABC123", model: "Sultan RS", buyer: "John Doe", price: 92000 },
  { plate: "12XYZ890", model: "Elegy Retro", buyer: "Jane Roe", price: 74500 },
  { plate: "77KLM456", model: "Comet S2", buyer: "Sam Vance", price: 118000 },
  { plate: "31QRS002", model: "Futo GTX", buyer: "Mia Chen", price: 41000 },
  { plate: "58DEF741", model: "Banshee", buyer: "Otto Kranz", price: 88000 },
  { plate: "90GHI333", model: "Jester RR", buyer: "Lena Park", price: 132000 },
  { plate: "04TUV118", model: "Sentinel XS", buyer: "Ray Okafor", price: 63000 },
  { plate: "22NOP654", model: "Dominator", buyer: "Iris Bloom", price: 57000 },
  { plate: "67WXY210", model: "Rapid GT", buyer: "Dan Vega", price: 79000 },
  { plate: "88ZAB975", model: "Feltzer", buyer: "Kira Sol", price: 68000 },
  { plate: "13CDE486", model: "Zion Cabrio", buyer: "Paul Rime", price: 52000 },
  { plate: "45FGH129", model: "Schafter V12", buyer: "Nina Frost", price: 96000 },
];

const columns: ColumnDef<Sale>[] = [
  { accessorKey: "plate", header: "Plate" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "buyer", header: "Buyer" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toLocaleString("en-US")}`,
  },
];

export default function DataTableBasic() {
  return (
    <div className="h-[460px] w-full">
      <DataTable
        columns={columns}
        data={SALES}
        searchPlaceholder="Search sales…"
        toolbar={<Button size="sm">Export</Button>}
        countLabel={(count) => `${count} sale(s)`}
      />
    </div>
  );
}
