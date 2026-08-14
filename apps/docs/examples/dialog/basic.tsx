"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sell vehicle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Sell to player</DialogTitle>
          <DialogDescription>
            The buyer is charged immediately and the keys transfer on confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="buyer">Buyer ID</Label>
          <Input id="buyer" placeholder="17" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default2">Cancel</Button>
          </DialogClose>
          <Button>Confirm sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
