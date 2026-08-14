"use client";

import { Button } from "@/components/ui/button";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>default</Button>
      <Button variant="default2">default2</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="link">link</Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="navigation">navigation</Button>
    </div>
  );
}
