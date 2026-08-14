"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Viewport,
  ViewportAction,
  ViewportContent,
  ViewportDescription,
  ViewportHeader,
  ViewportTitle,
} from "@/components/ui/viewport";
import { BoxesIcon, type BoxesIconHandle } from "@/components/ui/boxes";

const VEHICLES = [
  "Sultan RS", "Elegy Retro", "Comet S2", "Futo GTX", "Banshee",
  "Jester RR", "Sentinel XS", "Dominator", "Rapid GT", "Feltzer",
  "Zion Cabrio", "Schafter V12", "Kuruma", "Massacro", "Ninef",
];

/**
 * Scroll this — the header blur-swaps to a sticky copy of itself, the glass
 * bands fade in at the edges, and the custom scrollbar appears on the right
 * and can be dragged.
 */
export default function ViewportBasic() {
  const icon = React.useRef<BoxesIconHandle>(null);

  return (
    <Viewport className="h-[420px] w-full max-w-[560px]">
      <ViewportHeader>
        <ViewportTitle>
          <SectionHeader
            icon={<BoxesIcon ref={icon} size={20} className="text-primary" />}
            title="Stock"
            onMouseEnter={() => icon.current?.startAnimation()}
            onMouseLeave={() => icon.current?.stopAnimation()}
          />
        </ViewportTitle>
        <ViewportDescription>Everything on the floor right now.</ViewportDescription>
        <ViewportAction>
          <Button size="sm">Order</Button>
        </ViewportAction>
      </ViewportHeader>
      <ViewportContent className="flex flex-col gap-2">
        {VEHICLES.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border bg-input px-3 py-2.5 text-sm"
          >
            <span>{name}</span>
            <span className="text-muted-foreground text-xs">in stock</span>
          </div>
        ))}
      </ViewportContent>
    </Viewport>
  );
}
