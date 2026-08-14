"use client";

import { Button } from "@/components/ui/button";
import { InfoTip, Tip } from "@/components/ui/info-tip";
import { Label } from "@/components/ui/label";

export default function InfoTipBasic() {
  return (
    <div className="flex flex-col items-start gap-5">
      <Label>
        Dealer cost
        <InfoTip>
          What the shop pays. The sale price is this plus your margin, and the
          difference is what lands in the society account.
        </InfoTip>
      </Label>

      <Tip label="Refunds the buyer in full" side="right">
        <Button variant="default2">Cancel sale</Button>
      </Tip>

      {/* A disabled button swallows pointer events, so the trigger has to be a
          wrapper the tooltip can actually hover. */}
      <Tip label="You do not have permission for this">
        <span className="inline-flex">
          <Button disabled>Delete shop</Button>
        </span>
      </Tip>
    </div>
  );
}
