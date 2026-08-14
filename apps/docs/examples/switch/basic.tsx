"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchBasic() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="sw-default" checked={enabled} onCheckedChange={setEnabled} />
        <Label htmlFor="sw-default">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="sw-sm" size="sm" defaultChecked />
        <Label htmlFor="sw-sm">Small</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="sw-off" disabled />
        <Label htmlFor="sw-off">Disabled</Label>
      </div>
    </div>
  );
}
