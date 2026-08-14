"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * `variant="line"` is what the dashboard header uses: no pill background, the
 * active tab marked with a primary underline instead.
 */
export default function TabsLine() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="catalog">Catalog</TabsTrigger>
        <TabsTrigger value="finance">Finance</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
