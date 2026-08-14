import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon } from "@/components/ui/trending-up"
import { TrendingDownIcon } from "@/components/ui/trending-down"
import { cn } from "@/lib/utils"

/**
 * A headline metric: icon chip, label, big Phudu number, optional trend line.
 *
 * ```tsx
 * <StatCard
 *   icon={<UsersIcon ref={ref} size={20} className="text-primary" />}
 *   label={t("ui.overview.playersOnline")}
 *   value={42}
 *   trend={{ percent: 12.5, label: t("ui.overview.fromLastWeek", { percent: "12.5%" }) }}
 *   onMouseEnter={() => ref.current?.startAnimation()}
 * />
 * ```
 *
 * `trend.label` is the whole sentence, already translated and interpolated.
 * The card decides the arrow and the colour from `percent`, but never builds
 * the string — pluralisation and word order are the locale's business.
 */
function StatCard({
  icon,
  label,
  value,
  trend,
  className,
  ...props
}: {
  icon?: React.ReactNode
  label: React.ReactNode
  value: React.ReactNode
  trend?: {
    /** Signed. Sign picks the arrow and the colour; magnitude is unused. */
    percent: number
    label: React.ReactNode
  }
} & React.ComponentProps<"div">) {
  const Arrow = trend && trend.percent < 0 ? TrendingDownIcon : TrendingUpIcon
  const trendClass =
    !trend || trend.percent === 0
      ? "text-muted-foreground"
      : trend.percent > 0
        ? "text-primary"
        : "text-red-400"

  return (
    <Card
      data-slot="stat-card"
      className={cn("flex flex-col justify-between", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        {icon ? (
          <div className="flex items-center gap-2 bg-border rounded-md p-2.5">{icon}</div>
        ) : null}
        <CardTitle className="text-2xl font-bold leading-[1] !font-[phudu]">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold !font-[phudu]">{value}</div>
        {trend ? (
          <p className={cn("text-xs flex items-center gap-1", trendClass)}>
            <Arrow size={12} />
            {trend.label}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { StatCard }
