import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

const PAGE_VARIANTS = {
  initial: { opacity: 0, scale: 0.995 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.995 },
}

/**
 * Cross-fades between the pages of a dashboard.
 *
 * `mode="wait"` so the outgoing page is gone before the incoming one mounts —
 * overlapping them would double-mount data-fetching subpages and, at this
 * scale of movement, just reads as a smear.
 *
 * The scale delta is deliberately tiny (0.995). Anything more looks like a
 * modal opening rather than a tab switching, and in CEF a larger transform on
 * a full-size subtree is where compositing starts to stutter.
 *
 * ```tsx
 * <PageTransition pageKey={currentTab}>
 *   {currentTab === "players" && <PlayersPage />}
 * </PageTransition>
 * ```
 */
function PageTransition({
  pageKey,
  className,
  children,
}: {
  /** Changing this is what triggers the transition — the active page id. */
  pageKey: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        data-slot="page-transition"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={PAGE_VARIANTS}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className={cn("flex-1 min-h-0 h-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export { PageTransition, PAGE_VARIANTS }
