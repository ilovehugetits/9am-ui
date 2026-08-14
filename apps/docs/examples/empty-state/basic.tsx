"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BoxesIcon, type BoxesIconHandle } from "@/components/ui/boxes";

export default function EmptyStateBasic() {
  const icon = React.useRef<BoxesIconHandle>(null);

  return (
    <div className="w-full max-w-[420px] rounded-lg border bg-card">
      <EmptyState
        icon={<BoxesIcon ref={icon} size={28} />}
        message="No vehicles in stock."
        action={
          <Button variant="default2" size="sm">
            Order stock
          </Button>
        }
        onMouseEnter={() => icon.current?.startAnimation()}
        onMouseLeave={() => icon.current?.stopAnimation()}
      />
    </div>
  );
}
