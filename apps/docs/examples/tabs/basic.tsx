"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsBasic() {
  return (
    <Tabs defaultValue="stock" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="stock">Stock</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
      </TabsList>
      <TabsContent value="stock" className="text-sm text-muted-foreground">
        14 vehicles on the floor.
      </TabsContent>
      <TabsContent value="sales" className="text-sm text-muted-foreground">
        17 sales this week.
      </TabsContent>
      <TabsContent value="staff" className="text-sm text-muted-foreground">
        6 employees clocked in.
      </TabsContent>
    </Tabs>
  );
}
