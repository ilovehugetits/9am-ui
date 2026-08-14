"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsVertical() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-[420px]">
      <TabsList variant="line">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-sm text-muted-foreground">
        Shop name, blip and location.
      </TabsContent>
      <TabsContent value="pricing" className="text-sm text-muted-foreground">
        Margins, taxes and financing terms.
      </TabsContent>
      <TabsContent value="access" className="text-sm text-muted-foreground">
        Which jobs and grades can open the menu.
      </TabsContent>
    </Tabs>
  );
}
