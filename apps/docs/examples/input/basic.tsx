"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputBasic() {
  return (
    <div className="flex w-[280px] flex-col gap-2">
      <Label htmlFor="plate">Plate</Label>
      <Input id="plate" placeholder="46 ABC 123" />
    </div>
  );
}
