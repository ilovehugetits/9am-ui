import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The 9AM full-screen frame: a fixed-size panel centred in the NUI viewport.
 *
 * Fixed rather than fluid on purpose. The NUI is composited over the game at
 * whatever resolution the player runs, and a fluid layout means a dashboard
 * that is cramped at 1080p and stretched to nothing at ultrawide. A fixed
 * 1280x720 panel is identical for everyone and matches the proportions the
 * design language was drawn at.
 *
 * The outer div stays transparent — the game shows through around the panel.
 *
 * ```tsx
 * <AppShell>
 *   <DashboardHeader … />
 *   <PageTransition pageKey={tab}>{…}</PageTransition>
 * </AppShell>
 * ```
 */
function AppShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="h-full w-full max-w-screen flex items-center justify-center relative overflow-hidden">
      <div
        data-slot="app-shell"
        className={cn(
          // pb-0: the page area below the header runs to the panel edge, so a
          // scrolling subpage fades out against it instead of stopping short.
          "max-w-[1280px] w-full h-[720px] max-h-[720px] overflow-hidden flex flex-col bg-background rounded-3xl gap-4 p-3 pb-0",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { AppShell }
