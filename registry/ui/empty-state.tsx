import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * What a list renders instead of nothing.
 *
 * Sized and muted to match the empty lists across the 9AM scripts, so "no
 * results" reads as a state rather than as a broken panel.
 *
 * ```tsx
 * {players.length === 0 && <EmptyState message={t("ui.players.empty")} />}
 * ```
 */
function EmptyState({
  message,
  icon,
  action,
  className,
  ...props
}: {
  message: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
} & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 h-32 text-foreground/50 text-base",
        className
      )}
      {...props}
    >
      {icon}
      <span>{message}</span>
      {action}
    </div>
  )
}

export { EmptyState }
