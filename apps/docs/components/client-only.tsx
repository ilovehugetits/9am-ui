"use client";

import * as React from "react";

/**
 * Render children only after mount.
 *
 * The registry components are written for a Vite SPA — there is no server in a
 * FiveM NUI, so nothing in them is built to survive prerendering, and the
 * portal-based ones (dialog, tooltip, select, popover) reach for `document`
 * during render. Prerendering them here would mean either patching shipped
 * components to satisfy a constraint their real consumers do not have, or
 * pinning a Radix version for the docs' benefit. Neither is worth it for a
 * preview pane.
 *
 * The fallback reserves the same box so the page does not jump on hydration.
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-6 w-24 animate-pulse rounded-md bg-muted-foreground/15"
      />
    );
  }

  return <>{children}</>;
}
