"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LabelBasic() {
  return (
    <div className="flex w-[280px] flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="owner">Owner</Label>
        <Input id="owner" placeholder="John Doe" />
      </div>
      <Label htmlFor="repo" className="justify-between">
        Repossess on impound
        <Switch id="repo" />
      </Label>
    </div>
  );
}
