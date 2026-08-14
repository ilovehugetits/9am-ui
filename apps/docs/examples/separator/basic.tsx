"use client";

import { Separator } from "@/components/ui/separator";

export default function SeparatorBasic() {
  return (
    <div className="w-[320px]">
      <div className="text-sm">Garage</div>
      <p className="text-sm text-muted-foreground">Vehicles you own.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Owned</span>
        <Separator orientation="vertical" />
        <span>Impounded</span>
        <Separator orientation="vertical" />
        <span>Sold</span>
      </div>
    </div>
  );
}
