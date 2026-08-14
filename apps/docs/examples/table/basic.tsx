"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROWS = [
  { plate: "46ABC123", model: "Sultan RS", owner: "John Doe", price: "$92,000" },
  { plate: "12XYZ890", model: "Elegy Retro", owner: "Jane Roe", price: "$74,500" },
  { plate: "77KLM456", model: "Comet S2", owner: "Sam Vance", price: "$118,000" },
];

export default function TableBasic() {
  return (
    <Table className="w-[560px]">
      <TableCaption>Vehicles sold this week.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Plate</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.plate}>
            <TableCell className="font-mono text-xs">{row.plate}</TableCell>
            <TableCell>{row.model}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell className="text-right">{row.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$284,500</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
