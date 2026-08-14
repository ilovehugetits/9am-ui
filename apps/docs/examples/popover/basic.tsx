"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default2">Adjust margin</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <PopoverHeader>
          <PopoverTitle>Margin</PopoverTitle>
          <PopoverDescription>Applied on top of dealer cost.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 flex flex-col gap-2">
          <Label htmlFor="margin">Percent</Label>
          <Input id="margin" type="number" defaultValue={18} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
