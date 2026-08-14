"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import { TruckIcon, type TruckIconHandle } from "@/components/ui/truck";

/** Every icon's handle has this shape; most export it as `<Name>IconHandle`. */
type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

/**
 * Two ways to drive an icon.
 *
 * Left: no ref attached, so the icon animates on its own hover — fine for a
 * standalone glyph. Right: a ref is attached, which switches the icon into
 * controlled mode and hands the trigger to the parent, so the whole row fires
 * it. That second mode is what tabs, table rows and stat cards use.
 */
export default function IconRef() {
  const truck = React.useRef<TruckIconHandle>(null);
  const refresh = React.useRef<IconHandle>(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <RefreshCWIcon size={28} className="text-primary" />
          <span className="text-xs text-muted-foreground">hover the icon</span>
        </div>

        <div
          className="flex cursor-default flex-col items-center gap-2 rounded-lg border bg-card px-6 py-3"
          onMouseEnter={() => truck.current?.startAnimation()}
          onMouseLeave={() => truck.current?.stopAnimation()}
        >
          <TruckIcon ref={truck} size={28} className="text-primary" />
          <span className="text-xs text-muted-foreground">hover the card</span>
        </div>
      </div>

      <Button
        variant="default2"
        size="sm"
        onClick={() => refresh.current?.startAnimation()}
      >
        <RefreshCWIcon ref={refresh} size={14} />
        Fire from an event
      </Button>
    </div>
  );
}
