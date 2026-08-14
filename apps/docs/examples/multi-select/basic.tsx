"use client";

import * as React from "react";

import { MultiSelect } from "@/components/ui/multi-select";

const CLASSES = [
  { value: "sports", label: "Sports" },
  { value: "super", label: "Super" },
  { value: "muscle", label: "Muscle" },
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedan" },
  { value: "compact", label: "Compact" },
  { value: "motorcycle", label: "Motorcycle" },
];

export default function MultiSelectBasic() {
  const [selected, setSelected] = React.useState<string[]>(["sports", "super"]);

  return (
    <div className="w-[320px]">
      <MultiSelect
        options={CLASSES}
        selected={selected}
        onSelectionChange={setSelected}
        placeholder="Stocked classes"
      />
    </div>
  );
}
