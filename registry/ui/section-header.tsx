import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The title row every 9AM subpage opens with: an icon in a chip, the page
 * name in Phudu, and an optional action pinned to the right.
 *
 * Drop it inside a ViewportTitle so it inherits the header's blur-swap on
 * scroll:
 *
 * ```tsx
 * <ViewportHeader>
 *   <ViewportTitle>
 *     <SectionHeader
 *       icon={<UsersIcon ref={iconRef} size={20} className="text-primary" />}
 *       title={t("ui.players.title")}
 *       onMouseEnter={() => iconRef.current?.startAnimation()}
 *       action={<Button>…</Button>}
 *     />
 *   </ViewportTitle>
 * </ViewportHeader>
 * ```
 *
 * The icon is a node rather than a component prop so the caller keeps the ref
 * — the kit's icons animate through an imperative handle, and hover usually
 * belongs to this whole row rather than the icon's own hit box.
 */
function SectionHeader({
  icon,
  title,
  action,
  className,
  ...props
}: {
  icon?: React.ReactNode
  title: React.ReactNode
  action?: React.ReactNode
} & Omit<React.ComponentProps<"div">, "title">) {
  return (
    <div
      data-slot="section-header"
      className={cn("flex flex-row items-center justify-between w-full gap-4", className)}
      {...props}
    >
      <div className="flex items-center gap-2 text-2xl !font-[phudu] font-semibold leading-[1]">
        {icon ? (
          <div className="flex items-center gap-2 bg-input border rounded-lg p-2.5">{icon}</div>
        ) : null}
        {title}
      </div>
      {action}
    </div>
  )
}

export { SectionHeader }
