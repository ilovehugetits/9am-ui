"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { CartIcon, type CartIconHandle } from "@/components/ui/cart";

/**
 * The kit's icons animate through an imperative handle, so hover belongs to
 * the button rather than to the icon's own hit box — otherwise the animation
 * only fires on the 16px the glyph occupies, not on the control.
 */
export default function ButtonWithIcon() {
  const icon = React.useRef<CartIconHandle>(null);

  return (
    <Button
      onMouseEnter={() => icon.current?.startAnimation()}
      onMouseLeave={() => icon.current?.stopAnimation()}
    >
      <CartIcon ref={icon} size={16} />
      Buy vehicle
    </Button>
  );
}
