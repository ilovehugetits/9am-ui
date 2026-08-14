"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { DashboardHeader, type DashboardTab } from "@/components/ui/dashboard-header";
import { LayoutGridIcon } from "@/components/ui/layout-grid";
import { BoxesIcon } from "@/components/ui/boxes";
import { CircleDollarSignIcon } from "@/components/ui/circle-dollar-sign";
import { UsersIcon } from "@/components/ui/users";
import { XIcon } from "@/components/ui/x";

const TABS: DashboardTab[] = [
  { value: "overview", label: "Overview", icon: LayoutGridIcon },
  { value: "stock", label: "Stock", icon: BoxesIcon },
  { value: "finance", label: "Finance", icon: CircleDollarSignIcon },
  { value: "staff", label: "Staff", icon: UsersIcon },
];

export default function DashboardHeaderBasic() {
  const [tab, setTab] = React.useState("overview");

  return (
    <div className="w-full max-w-[900px] rounded-2xl border bg-background p-3">
      <DashboardHeader
        tabs={TABS}
        value={tab}
        onValueChange={setTab}
        greeting="Welcome back,"
        name="John Doe"
        avatar={<span className="font-display text-lg text-primary">JD</span>}
        actions={
          <Button variant="default2" size="icon" aria-label="Close">
            <XIcon size={16} />
          </Button>
        }
      />
    </div>
  );
}
