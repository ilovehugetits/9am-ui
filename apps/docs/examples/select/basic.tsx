"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectBasic() {
  return (
    <Select defaultValue="sports">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a class" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Performance</SelectLabel>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="super">Super</SelectItem>
          <SelectItem value="muscle">Muscle</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Utility</SelectLabel>
          <SelectItem value="suv">SUV</SelectItem>
          <SelectItem value="van">Van</SelectItem>
          <SelectItem value="offroad" disabled>
            Off-road — out of stock
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
