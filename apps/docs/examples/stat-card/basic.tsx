"use client";

import * as React from "react";

import { StatCard } from "@/components/ui/stat-card";
import { UsersIcon, type UsersIconHandle } from "@/components/ui/users";
import { WalletIcon, type WalletIconHandle } from "@/components/ui/wallet";
import { CartIcon, type CartIconHandle } from "@/components/ui/cart";

export default function StatCardBasic() {
  const players = React.useRef<UsersIconHandle>(null);
  const revenue = React.useRef<WalletIconHandle>(null);
  const sales = React.useRef<CartIconHandle>(null);

  return (
    <div className="grid w-full max-w-[720px] gap-3 sm:grid-cols-3">
      <StatCard
        icon={<UsersIcon ref={players} size={20} className="text-primary" />}
        label="Players"
        value={42}
        trend={{ percent: 12.5, label: "+12.5% from last week" }}
        onMouseEnter={() => players.current?.startAnimation()}
        onMouseLeave={() => players.current?.stopAnimation()}
      />
      <StatCard
        icon={<WalletIcon ref={revenue} size={20} className="text-primary" />}
        label="Revenue"
        value="$184,320"
        trend={{ percent: -3.1, label: "-3.1% from last week" }}
        onMouseEnter={() => revenue.current?.startAnimation()}
        onMouseLeave={() => revenue.current?.stopAnimation()}
      />
      <StatCard
        icon={<CartIcon ref={sales} size={20} className="text-primary" />}
        label="Sales"
        value={17}
        onMouseEnter={() => sales.current?.startAnimation()}
        onMouseLeave={() => sales.current?.stopAnimation()}
      />
    </div>
  );
}
