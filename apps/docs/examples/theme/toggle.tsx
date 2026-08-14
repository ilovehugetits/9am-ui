"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  ThemeToggleIcon,
  type ThemeToggleIconHandle,
} from "@/components/ui/theme-toggle";
import type { Theme } from "@/hooks/useTheme";

/**
 * In a script this reads `useTheme()` from the kit store, which owns the
 * `.dark` class on the html element. This page is an ordinary website with its
 * own theme switcher, so the example holds the value locally rather than
 * fighting it — the icon and its crossfade are the part being demonstrated.
 */
export default function ThemeToggleExample() {
  const [theme, setTheme] = React.useState<Theme>("dark");
  const icon = React.useRef<ThemeToggleIconHandle>(null);

  return (
    <Button
      variant="default2"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      onMouseEnter={() => icon.current?.startAnimation()}
      onMouseLeave={() => icon.current?.stopAnimation()}
    >
      <ThemeToggleIcon ref={icon} theme={theme} size={16} />
    </Button>
  );
}
