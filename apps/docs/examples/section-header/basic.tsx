"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { UsersIcon, type UsersIconHandle } from "@/components/ui/users";
import { PlusIcon } from "@/components/ui/plus";

export default function SectionHeaderBasic() {
  const icon = React.useRef<UsersIconHandle>(null);

  return (
    <div className="w-full max-w-[560px]">
      <SectionHeader
        icon={<UsersIcon ref={icon} size={20} className="text-primary" />}
        title="Employees"
        onMouseEnter={() => icon.current?.startAnimation()}
        onMouseLeave={() => icon.current?.stopAnimation()}
        action={
          <Button size="sm">
            <PlusIcon size={14} />
            Hire
          </Button>
        }
      />
    </div>
  );
}
