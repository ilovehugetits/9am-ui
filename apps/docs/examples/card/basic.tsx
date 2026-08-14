"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardBasic() {
  return (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle>Impound lot</CardTitle>
        <CardDescription>3 vehicles waiting for release.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Release fees are charged to the owner on collection.
      </CardContent>
      <CardFooter>
        <Button size="sm">Release all</Button>
      </CardFooter>
    </Card>
  );
}
