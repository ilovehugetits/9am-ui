"use client";

import * as React from "react";

import { PageTransition } from "@/components/ui/page-transition";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGES: Record<string, { title: string; body: string }> = {
  overview: { title: "Overview", body: "42 players online, 17 sales today." },
  catalog: { title: "Catalog", body: "14 vehicles on the floor across 5 classes." },
  finance: { title: "Finance", body: "$184,320 in the society account." },
};

export default function PageTransitionBasic() {
  const [page, setPage] = React.useState("overview");
  const current = PAGES[page];

  return (
    <div className="flex w-full max-w-[460px] flex-col gap-4">
      <Tabs value={page} onValueChange={setPage}>
        <TabsList variant="line">
          {Object.keys(PAGES).map((key) => (
            <TabsTrigger key={key} value={key} className="capitalize">
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="h-[120px]">
        <PageTransition pageKey={page}>
          <div className="rounded-xl border bg-card p-4">
            <div className="font-display text-lg">{current.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{current.body}</p>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
