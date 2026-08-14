"use client";

import * as React from "react";

import { ArrowLeftIcon } from "@/components/ui/arrow-left";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { BadgePercentIcon } from "@/components/ui/badge-percent";
import { BoxIcon } from "@/components/ui/box";
import { BoxesIcon } from "@/components/ui/boxes";
import { CalendarDaysIcon } from "@/components/ui/calendar-days";
import { CartIcon } from "@/components/ui/cart";
import { ChartColumnIncreasingIcon } from "@/components/ui/chart-column-increasing";
import { CheckIcon } from "@/components/ui/check";
import { ChevronDownIcon } from "@/components/ui/chevron-down";
import { ChevronLeftIcon } from "@/components/ui/chevron-left";
import { ChevronRightIcon } from "@/components/ui/chevron-right";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import { CircleCheckIcon } from "@/components/ui/circle-check";
import { CircleDollarSignIcon } from "@/components/ui/circle-dollar-sign";
import { ClockIcon } from "@/components/ui/clock";
import { CreditCardIcon } from "@/components/ui/credit-card";
import { DeleteIcon } from "@/components/ui/delete";
import { DollarSignIcon } from "@/components/ui/dollar-sign";
import { DropletIcon } from "@/components/ui/droplet";
import { FolderOpenIcon } from "@/components/ui/folder-open";
import { GripIcon } from "@/components/ui/grip";
import { HandCoinsIcon } from "@/components/ui/hand-coins";
import { HandHelpingIcon } from "@/components/ui/hand-helping";
import { HardDriveDownloadIcon } from "@/components/ui/hard-drive-download";
import { LayoutGridIcon } from "@/components/ui/layout-grid";
import { LoaderCircleIcon } from "@/components/ui/loader-circle";
import { MapPinIcon } from "@/components/ui/map-pin";
import { MenuIcon } from "@/components/ui/menu";
import { PlusIcon } from "@/components/ui/plus";
import { ReceiptIcon } from "@/components/ui/receipt";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import { RouteIcon } from "@/components/ui/route";
import { SearchIcon } from "@/components/ui/search";
import { SendIcon } from "@/components/ui/send";
import { SettingsIcon } from "@/components/ui/settings";
import { SquarePenIcon } from "@/components/ui/square-pen";
import { TrendingDownIcon } from "@/components/ui/trending-down";
import { TrendingUpIcon } from "@/components/ui/trending-up";
import { TruckIcon } from "@/components/ui/truck";
import { UserRoundPlusIcon } from "@/components/ui/user-round-plus";
import { UserRoundXIcon } from "@/components/ui/user-round-x";
import { UserIcon } from "@/components/ui/user";
import { UsersIcon } from "@/components/ui/users";
import { WalletIcon } from "@/components/ui/wallet";
import { XIcon } from "@/components/ui/x";

/**
 * Every animated icon in the registry, live.
 *
 * The icons animate through an imperative handle rather than CSS, so the
 * gallery holds a ref per icon and drives it from the tile hover — which is
 * exactly how a consumer uses them from a tab or a table row. Hovering the
 * SVG itself would work too (each icon falls back to self-driving when no ref
 * is attached), but that is not the interesting case to demonstrate.
 */

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

const ICONS: { name: string; Icon: React.ComponentType<{ size?: number; className?: string; ref?: React.Ref<IconHandle> }> }[] = [
  { name: "arrow-left", Icon: ArrowLeftIcon },
  { name: "arrow-right", Icon: ArrowRightIcon },
  { name: "badge-percent", Icon: BadgePercentIcon },
  { name: "box", Icon: BoxIcon },
  { name: "boxes", Icon: BoxesIcon },
  { name: "calendar-days", Icon: CalendarDaysIcon },
  { name: "cart", Icon: CartIcon },
  { name: "chart-column-increasing", Icon: ChartColumnIncreasingIcon },
  { name: "check", Icon: CheckIcon },
  { name: "chevron-down", Icon: ChevronDownIcon },
  { name: "chevron-left", Icon: ChevronLeftIcon },
  { name: "chevron-right", Icon: ChevronRightIcon },
  { name: "chevron-up", Icon: ChevronUpIcon },
  { name: "circle-check", Icon: CircleCheckIcon },
  { name: "circle-dollar-sign", Icon: CircleDollarSignIcon },
  { name: "clock", Icon: ClockIcon },
  { name: "credit-card", Icon: CreditCardIcon },
  { name: "delete", Icon: DeleteIcon },
  { name: "dollar-sign", Icon: DollarSignIcon },
  { name: "droplet", Icon: DropletIcon },
  { name: "folder-open", Icon: FolderOpenIcon },
  { name: "grip", Icon: GripIcon },
  { name: "hand-coins", Icon: HandCoinsIcon },
  { name: "hand-helping", Icon: HandHelpingIcon },
  { name: "hard-drive-download", Icon: HardDriveDownloadIcon },
  { name: "layout-grid", Icon: LayoutGridIcon },
  { name: "loader-circle", Icon: LoaderCircleIcon },
  { name: "map-pin", Icon: MapPinIcon },
  { name: "menu", Icon: MenuIcon },
  { name: "plus", Icon: PlusIcon },
  { name: "receipt", Icon: ReceiptIcon },
  { name: "refresh-cw", Icon: RefreshCWIcon },
  { name: "route", Icon: RouteIcon },
  { name: "search", Icon: SearchIcon },
  { name: "send", Icon: SendIcon },
  { name: "settings", Icon: SettingsIcon },
  { name: "square-pen", Icon: SquarePenIcon },
  { name: "trending-down", Icon: TrendingDownIcon },
  { name: "trending-up", Icon: TrendingUpIcon },
  { name: "truck", Icon: TruckIcon },
  { name: "user-round-plus", Icon: UserRoundPlusIcon },
  { name: "user-round-x", Icon: UserRoundXIcon },
  { name: "user", Icon: UserIcon },
  { name: "users", Icon: UsersIcon },
  { name: "wallet", Icon: WalletIcon },
  { name: "x", Icon: XIcon },
];

export function IconGallery() {
  const [query, setQuery] = React.useState("");
  const handles = React.useRef<Record<string, IconHandle | null>>({});

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ICONS.filter((i) => i.name.includes(q)) : ICONS;
  }, [query]);

  return (
    <div className="not-prose my-6" data-preview="">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter icons…"
        className="mb-4 h-9 w-full rounded-lg border bg-black/[0.05] px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring dark:bg-white/10"
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {filtered.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            onMouseEnter={() => handles.current[name]?.startAnimation()}
            onMouseLeave={() => handles.current[name]?.stopAnimation()}
            onClick={() => navigator.clipboard?.writeText(`@9am/icon-${name}`)}
            title={`Copy @9am/icon-${name}`}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border bg-card p-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Icon
              size={24}
              ref={(handle: IconHandle | null) => {
                handles.current[name] = handle;
              }}
            />
            <span className="w-full truncate text-center text-[10px] leading-tight">{name}</span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex h-32 flex-col items-center justify-center gap-2.5 text-base text-foreground/50">
          No icon matches “{query}”.
        </div>
      )}
    </div>
  );
}
