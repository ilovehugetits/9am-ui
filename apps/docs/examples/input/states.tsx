"use client";

import { Input } from "@/components/ui/input";

export default function InputStates() {
  return (
    <div className="flex w-[280px] flex-col gap-3">
      <Input placeholder="Default" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Invalid" aria-invalid />
      <Input type="number" placeholder="Number — spinners are suppressed" />
    </div>
  );
}
