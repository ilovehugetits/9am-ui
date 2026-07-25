import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoTip } from "@/components/ui/info-tip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import { Calendar } from "@/components/ui/calendar";
import {
  Viewport,
  ViewportHeader,
  ViewportTitle,
  ViewportDescription,
  ViewportAction,
  ViewportContent,
} from "@/components/ui/viewport";
import { ThemeToggleIcon } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/useTheme";

/* ------------------------------------------------------------------ layout */

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="!font-[phudu] text-2xl text-foreground">{title}</h2>
        {note && <span className="text-muted-foreground text-xs">{note}</span>}
      </div>
      <div className="rounded-2xl border bg-card p-6">{children}</div>
    </section>
  );
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

/* ------------------------------------------------------------------ tokens */

const SURFACE_TOKENS = [
  "background", "foreground", "card", "popover", "primary", "primary-foreground",
  "secondary", "muted", "muted-foreground", "accent", "destructive", "border", "input", "ring",
];
/* The ramp lives in `@theme inline`, which means Tailwind inlines the values
   into utilities instead of emitting custom properties — `var(--color-primary-50)`
   resolves to nothing. Reference the generated utilities, spelled out in full so
   the class scanner can actually see them. */
const RAMP: Array<[number, string]> = [
  [50, "bg-primary-50"], [100, "bg-primary-100"], [200, "bg-primary-200"],
  [300, "bg-primary-300"], [400, "bg-primary-400"], [500, "bg-primary-500"],
  [600, "bg-primary-600"], [700, "bg-primary-700"], [800, "bg-primary-800"],
  [900, "bg-primary-900"], [950, "bg-primary-950"],
];

function Tokens() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">Semantic tokens</div>
        <div className="grid grid-cols-7 gap-2">
          {SURFACE_TOKENS.map((t) => (
            <div key={t} className="flex flex-col gap-1.5">
              <div className="h-12 rounded-lg border" style={{ background: `var(--${t})` }} />
              <span className="text-[10px] text-muted-foreground truncate">--{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">Primary ramp</div>
        <div className="flex rounded-lg overflow-hidden border">
          {RAMP.map(([n, cls]) => (
            <div key={n} className={`flex-1 h-12 flex items-end justify-center pb-1 ${cls}`}>
              <span className={`text-[9px] ${n >= 700 ? "text-white/60" : "text-black/50"}`}>{n}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">Type</div>
        <p className="!font-[phudu] text-3xl">Phudu — display / headings</p>
        <p className="text-base">Poppins — body copy at 400, <span className="font-medium">500</span>, <span className="font-semibold">600</span>, <span className="font-bold">700</span></p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- icons */

type IconComponent = React.ComponentType<{ size?: number; theme?: "light" | "dark" }>;

// Glob rather than 47 imports: an icon added to the registry shows up here with
// no edit, which is the point of a gallery that doubles as a smoke test.
const iconModules = import.meta.glob<Record<string, unknown>>("../../../registry/icons/*.tsx", { eager: true });

const isComponent = (v: unknown): v is IconComponent =>
  typeof v === "function" || (typeof v === "object" && v !== null && "$$typeof" in v);

const ICONS = Object.entries(iconModules)
  .map(([file, mod]) => {
    const name = file.split("/").pop()!.replace(".tsx", "");
    const entry = Object.entries(mod).find(([k, v]) => k.endsWith("Icon") && isComponent(v));
    return entry ? { name, exportName: entry[0], Icon: entry[1] as IconComponent } : null;
  })
  .filter((x): x is { name: string; exportName: string; Icon: IconComponent } => x !== null)
  .sort((a, b) => a.name.localeCompare(b.name));

function Icons({ theme }: { theme: "light" | "dark" }) {
  return (
    <>
      <p className="text-muted-foreground text-sm mb-4">
        {ICONS.length} icons — hover one to play its animation. Each exposes{" "}
        <code className="text-primary">startAnimation()</code>/<code className="text-primary">stopAnimation()</code> via ref so a
        parent (a tab, a row) can drive it.
      </p>
      <div className="grid grid-cols-8 gap-2">
        {ICONS.map(({ name, Icon }) => (
          <div
            key={name}
            className="group flex flex-col items-center gap-2 rounded-xl border p-3 bg-black/[0.05] dark:bg-white/10 hover:bg-[#F6E3711a] hover:border-primary/30 transition-colors cursor-pointer"
          >
            <Icon size={26} {...(name === "theme-toggle" ? { theme } : {})} />
            <span className="text-[10px] text-muted-foreground group-hover:text-primary truncate w-full text-center">{name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- data */

interface Sale { id: string; vehicle: string; buyer: string; price: string }
const SALES: Sale[] = [
  { id: "#1041", vehicle: "Pfister Comet S2", buyer: "J. Doe", price: "$1,878,000" },
  { id: "#1040", vehicle: "Ocelot Pariah", buyer: "M. Reyes", price: "$1,420,000" },
  { id: "#1039", vehicle: "Benefactor Schafter", buyer: "A. Novak", price: "$116,000" },
  { id: "#1038", vehicle: "Karin Sultan RS", buyer: "T. Lin", price: "$795,000" },
];
const SALE_COLUMNS = [
  { accessorKey: "id", header: "Order" },
  { accessorKey: "vehicle", header: "Vehicle" },
  { accessorKey: "buyer", header: "Buyer" },
  { accessorKey: "price", header: "Price" },
];

/* --------------------------------------------------------------------- app */

const NAV = [
  ["tokens", "Tokens"], ["buttons", "Buttons"], ["forms", "Forms"], ["tabs", "Tabs"],
  ["overlays", "Overlays"], ["data", "Data"], ["viewport", "Viewport"], ["icons", "Icons"],
] as const;

export default function Gallery() {
  const { theme, toggleTheme } = useTheme();
  const [checked, setChecked] = React.useState(true);
  const [multi, setMulti] = React.useState<string[]>(["sports"]);
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 6, 25));

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center gap-6">
            <span className="!font-[phudu] text-xl">9AM UI</span>
            <nav className="flex items-center gap-1 text-sm">
              {NAV.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-[#F6E3711a] transition-colors">
                  {label}
                </a>
              ))}
            </nav>
            <Button variant="default2" className="ml-auto h-9 px-3" onClick={toggleTheme}>
              <ThemeToggleIcon theme={theme} size={16} />
            </Button>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-8 py-10 flex flex-col gap-12">
          <Section id="tokens" title="Tokens" note="the locked layer — identical in every 9AM script">
            <Tokens />
          </Section>

          <Section id="buttons" title="Buttons">
            <div className="flex flex-col gap-4">
              <Row>
                {(["default", "default2", "destructive", "outline", "secondary", "ghost", "link", "navigation"] as const).map((v) => (
                  <Button key={v} variant={v}>{v}</Button>
                ))}
              </Row>
              <Separator />
              <Row>
                {(["sm", "default", "lg"] as const).map((s) => (
                  <Button key={s} size={s}>size {s}</Button>
                ))}
                <Button size="icon"><ThemeToggleIcon theme={theme} size={16} /></Button>
                <Button disabled>disabled</Button>
              </Row>
            </div>
          </Section>

          <Section id="forms" title="Form controls">
            <div className="grid grid-cols-3 gap-8">
              <Field>
                <FieldLabel htmlFor="p-name">Dealership name</FieldLabel>
                <Input id="p-name" placeholder="Premium Deluxe Motorsport" />
                <FieldDescription>Shown on the showroom stand.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="super">Super</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Stocked classes</FieldLabel>
                <MultiSelect
                  options={[
                    { value: "sports", label: "Sports" },
                    { value: "super", label: "Super" },
                    { value: "muscle", label: "Muscle" },
                    { value: "offroad", label: "Off-road" },
                  ]}
                  selected={multi}
                  onSelectionChange={setMulti}
                />
              </Field>
              <div className="flex items-center gap-3">
                <Switch id="p-sw" checked={checked} onCheckedChange={setChecked} />
                <Label htmlFor="p-sw">Test drives enabled</Label>
                <InfoTip>Players may drive a vehicle before purchase.</InfoTip>
              </div>
            </div>
          </Section>

          <Section id="tabs" title="Tabs" note="default (segmented) and line (gold underline)">
            <div className="flex flex-col gap-8">
              <Tabs defaultValue="a">
                <TabsList>
                  <TabsTrigger value="a">Overview</TabsTrigger>
                  <TabsTrigger value="b">Stock</TabsTrigger>
                  <TabsTrigger value="c">Sales</TabsTrigger>
                </TabsList>
                <TabsContent value="a" className="text-muted-foreground text-sm pt-3">Segmented variant.</TabsContent>
                <TabsContent value="b" className="text-muted-foreground text-sm pt-3">Stock panel.</TabsContent>
                <TabsContent value="c" className="text-muted-foreground text-sm pt-3">Sales panel.</TabsContent>
              </Tabs>
              <Tabs defaultValue="a">
                <TabsList variant="line">
                  <TabsTrigger value="a">Overview</TabsTrigger>
                  <TabsTrigger value="b">Stock</TabsTrigger>
                  <TabsTrigger value="c">Sales</TabsTrigger>
                </TabsList>
                <TabsContent value="a" className="text-muted-foreground text-sm pt-3">Line variant — the dashboard header uses this.</TabsContent>
                <TabsContent value="b" className="text-muted-foreground text-sm pt-3">Stock panel.</TabsContent>
                <TabsContent value="c" className="text-muted-foreground text-sm pt-3">Sales panel.</TabsContent>
              </Tabs>
            </div>
          </Section>

          <Section id="overlays" title="Overlays">
            <Row>
              <Dialog>
                <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm purchase</DialogTitle>
                    <DialogDescription>This will debit the buyer and register the vehicle.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="default2">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger asChild><Button variant="default2">Open popover</Button></PopoverTrigger>
                <PopoverContent className="w-72 text-sm text-muted-foreground">Popovers inherit the card surface and hairline border.</PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild><Button variant="outline">Hover for tooltip</Button></TooltipTrigger>
                <TooltipContent>Plain tooltip</TooltipContent>
              </Tooltip>
              <Card className="w-72">
                <CardHeader>
                  <CardTitle>Card</CardTitle>
                  <CardDescription>bg-input, rounded-2xl</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Content area.</CardContent>
              </Card>
            </Row>
          </Section>

          <Section id="data" title="Data">
            <div className="flex flex-col gap-8">
              <div>
                <div className="text-muted-foreground text-xs mb-3 uppercase tracking-wider">Table</div>
                <div className="rounded-lg border bg-input overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Order</TableHead><TableHead>Vehicle</TableHead><TableHead>Buyer</TableHead><TableHead>Price</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {SALES.map((s) => (
                        <TableRow key={s.id}><TableCell>{s.id}</TableCell><TableCell>{s.vehicle}</TableCell><TableCell>{s.buyer}</TableCell><TableCell>{s.price}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-3 uppercase tracking-wider">DataTable — search, sort, pagination</div>
                <DataTable columns={SALE_COLUMNS} data={SALES} />
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-3 uppercase tracking-wider">Calendar</div>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border bg-input w-fit" />
              </div>
            </div>
          </Section>

          <Section id="viewport" title="Viewport" note="scroll it — the header pins and the edges blur">
            <Viewport className="h-[420px]" fadeColor="var(--card)">
              <ViewportHeader className="px-4">
                <ViewportTitle className="!font-[phudu] text-xl">Vehicle stock</ViewportTitle>
                <ViewportDescription>Scroll: the real header blurs out and a sticky copy animates in.</ViewportDescription>
                <ViewportAction><Button size="sm">Add</Button></ViewportAction>
              </ViewportHeader>
              <ViewportContent className="px-4 pt-2 flex flex-col gap-2">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="rounded-xl border bg-black/[0.05] dark:bg-white/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm">{SALES[i % SALES.length].vehicle}</span>
                    <span className="text-sm text-primary">{SALES[i % SALES.length].price}</span>
                  </div>
                ))}
              </ViewportContent>
            </Viewport>
          </Section>

          <Section id="icons" title="Icons">
            <Icons theme={theme} />
          </Section>

          <footer className="text-muted-foreground text-xs pb-10">
            9AM UI — preview renders straight from <code>registry/</code>. If it breaks here, it breaks on install.
          </footer>
        </main>
      </div>
    </TooltipProvider>
  );
}
