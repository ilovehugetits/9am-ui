"use client";

import * as React from "react";

import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { DashboardHeader, type DashboardTab } from "@/components/ui/dashboard-header";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  Viewport,
  ViewportContent,
  ViewportHeader,
  ViewportTitle,
} from "@/components/ui/viewport";
import { BoxesIcon } from "@/components/ui/boxes";
import { CircleDollarSignIcon } from "@/components/ui/circle-dollar-sign";
import { LayoutGridIcon } from "@/components/ui/layout-grid";
import { UsersIcon } from "@/components/ui/users";
import { WalletIcon } from "@/components/ui/wallet";
import { XIcon } from "@/components/ui/x";

const TABS: DashboardTab[] = [
  { value: "overview", label: "Overview", icon: LayoutGridIcon },
  { value: "stock", label: "Stock", icon: BoxesIcon },
  { value: "finance", label: "Finance", icon: CircleDollarSignIcon },
];

const STOCK = ["Sultan RS", "Elegy Retro", "Comet S2", "Futo GTX", "Banshee"];

/** The frame every 9AM dashboard is assembled in, with a page inside it. */
export default function AppShellBasic() {
  const [tab, setTab] = React.useState("overview");

  return (
    <AppShell>
      <DashboardHeader
        tabs={TABS}
        value={tab}
        onValueChange={setTab}
        greeting="Welcome back,"
        name="John Doe"
        avatar={<span className="font-display text-xl text-primary">JD</span>}
        actions={
          <Button variant="default2" size="icon" aria-label="Close">
            <XIcon size={16} />
          </Button>
        }
      />

      <PageTransition pageKey={tab}>
        <Viewport className="h-full">
          <ViewportHeader>
            <ViewportTitle>
              <SectionHeader
                icon={<LayoutGridIcon size={20} className="text-primary" />}
                title="Overview"
              />
            </ViewportTitle>
          </ViewportHeader>
          <ViewportContent className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={<UsersIcon size={20} className="text-primary" />}
                label="Players"
                value={42}
                trend={{ percent: 12.5, label: "+12.5% from last week" }}
              />
              <StatCard
                icon={<WalletIcon size={20} className="text-primary" />}
                label="Revenue"
                value="$184,320"
                trend={{ percent: -3.1, label: "-3.1% from last week" }}
              />
              <StatCard
                icon={<BoxesIcon size={20} className="text-primary" />}
                label="In stock"
                value={14}
              />
            </div>
            {STOCK.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border bg-input px-3 py-2.5 text-sm"
              >
                <span>{name}</span>
                <span className="text-xs text-muted-foreground">available</span>
              </div>
            ))}
          </ViewportContent>
        </Viewport>
      </PageTransition>
    </AppShell>
  );
}
