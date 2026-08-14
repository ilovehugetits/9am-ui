import * as React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

type IconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

/** Shape of a 9AM animated icon — anything from @9am/icon-* satisfies it. */
type IconComponent = React.ComponentType<{
  size?: number
  className?: string
  style?: React.CSSProperties
  ref?: React.Ref<IconHandle>
}>

export interface DashboardTab {
  /** Identifies the tab. Whatever `value` / `onValueChange` speak in. */
  value: string
  label: React.ReactNode
  icon?: IconComponent
}

// Active tabs take the brand gold in dark and the deeper amber --primary in
// light; hover goes to the foreground extreme, idle sits at neutral grey.
// Set as inline colour rather than a class because the kit's icons paint their
// strokes from `color`, which a Tailwind text-* utility on the wrapper would
// not reach through the motion elements.
const COLOR_ACTIVE_DARK = "#F6E371"
const COLOR_ACTIVE_LIGHT = "var(--color-primary)"
const COLOR_HOVER_DARK = "#ffffff"
const COLOR_HOVER_LIGHT = "#18181b"
const COLOR_IDLE = "#6b7280"

/**
 * The 9AM dashboard header: who you are on the left, where you are in the
 * middle, what you can do on the right.
 *
 * Tabs are data rather than children on purpose. Each trigger needs its own
 * imperative animation handle and a three-state colour, which hand-rolled
 * comes to a dozen near-identical lines per tab — the kind of duplication that
 * drifts the moment someone adds a tab and copies the wrong block. Pass an
 * array; the ref plumbing stays in here.
 *
 * ```tsx
 * <DashboardHeader
 *   tabs={[{ value: "overview", label: t("ui.tabs.overview"), icon: LayoutGridIcon }]}
 *   value={tab}
 *   onValueChange={setTab}
 *   greeting={t("ui.header.welcome")}
 *   name={playerName}
 *   avatar={<img src={mugshot} className="w-full h-full object-contain" />}
 *   actions={<Button onClick={() => fetchNui("hideFrame")}>…</Button>}
 * />
 * ```
 *
 * Filter `tabs` to gate access — a tab the player cannot reach should not be
 * in the array at all, so there is no disabled trigger hinting at it.
 */
function DashboardHeader({
  tabs,
  value,
  onValueChange,
  name,
  greeting,
  avatar,
  actions,
  className,
  ...props
}: {
  tabs: DashboardTab[]
  value: string
  onValueChange: (value: string) => void
  name?: React.ReactNode
  greeting?: React.ReactNode
  avatar?: React.ReactNode
  actions?: React.ReactNode
} & Omit<React.ComponentProps<"div">, "onChange">) {
  const { theme } = useTheme()
  const [hovered, setHovered] = React.useState<string | null>(null)

  // One handle per tab, keyed by value — a plain array of refs would shift
  // under the tabs when the caller filters the list by permission.
  const handles = React.useRef<Record<string, IconHandle | null>>({})

  const iconColor = (tab: string) => {
    if (value === tab) return theme === "dark" ? COLOR_ACTIVE_DARK : COLOR_ACTIVE_LIGHT
    if (hovered === tab) return theme === "dark" ? COLOR_HOVER_DARK : COLOR_HOVER_LIGHT
    return COLOR_IDLE
  }

  return (
    <div
      data-slot="dashboard-header"
      className={cn("w-full flex items-center justify-between select-none", className)}
      {...props}
    >
      {(avatar || name || greeting) && (
        <div className="flex items-center gap-2.5 rounded-xl">
          {avatar ? (
            <div className="shadow-sm w-[48px] h-[48px] rounded-xl bg-black/[0.05] dark:bg-white/10 flex border items-center justify-center overflow-hidden">
              {avatar}
            </div>
          ) : null}
          <div className="flex flex-col gap-1.25">
            {greeting ? (
              <div className="text-foreground/50 leading-[1] text-sm font-normal flex items-center gap-1">
                {greeting}
              </div>
            ) : null}
            <div className="text-foreground text-base leading-[1]">{name}</div>
          </div>
        </div>
      )}

      <Tabs value={value} onValueChange={onValueChange} className="mx-auto">
        <TabsList variant="line">
          {tabs.map(({ value: tabValue, label, icon: Icon }) => (
            <TabsTrigger
              key={tabValue}
              value={tabValue}
              className="gap-1.5 font-medium text-base"
              onMouseEnter={() => {
                setHovered(tabValue)
                handles.current[tabValue]?.startAnimation()
              }}
              onMouseLeave={() => {
                setHovered(null)
                handles.current[tabValue]?.stopAnimation()
              }}
            >
              {Icon ? (
                <Icon
                  ref={(handle: IconHandle | null) => {
                    handles.current[tabValue] = handle
                  }}
                  size={24}
                  style={{ color: iconColor(tabValue) }}
                />
              ) : null}
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="min-w-[152px] flex items-center h-full justify-end gap-2.5">{actions}</div>
    </div>
  )
}

export { DashboardHeader }
