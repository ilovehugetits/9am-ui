"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/plus";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">small</Button>
      <Button size="default">default</Button>
      <Button size="lg">large</Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon size={16} />
      </Button>
    </div>
  );
}
