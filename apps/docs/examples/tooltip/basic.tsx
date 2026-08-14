"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TooltipBasic() {
  return (
    <div className="flex gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="default2">Top</Button>
        </TooltipTrigger>
        <TooltipContent>Impound the vehicle</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="default2">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">Charges a release fee</TooltipContent>
      </Tooltip>
    </div>
  );
}
