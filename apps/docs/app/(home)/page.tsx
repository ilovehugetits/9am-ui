import Link from "next/link";
import type { Metadata } from "next";
import { CopyCommand } from "@/components/copy-command";
import { getComponents, getIcons, getItems } from "@/lib/registry";
import { appDescription, githubUrl } from "@/lib/shared";

export const metadata: Metadata = {
  description: appDescription,
};

const PROPS = [
  {
    title: "Copy in, don't install",
    body: "A shadcn registry, not a package. Components are copied into each script, so a script can diverge when it genuinely needs to — and owns its UI outright when it ships to someone else's server.",
  },
  {
    title: "CEF-proofed",
    body: "FiveM runs Chromium 103. No :has(), no @container, no oklch(). The workarounds live in the kit once instead of in every script that rediscovers them.",
  },
  {
    title: "Drift-checked",
    body: "9am-ui check fails CI when the theme changes and warns when a component does. Identical tokens across every script is what makes them read as siblings.",
  },
  {
    title: "NUI plumbing included",
    body: "fetchNui, useNuiEvent, frame visibility with ESC and focus release, the theme store, and runtime i18n pulled from Lua. Not just the pretty parts.",
  },
];

export default function HomePage() {
  const components = getComponents();
  const icons = getIcons();
  const total = getItems().length;

  return (
    <main className="flex flex-1 flex-col">
      {/* ------------------------------------------------------------ hero */}
      <section className="mx-auto w-full max-w-[820px] px-6 pt-24 pb-20 sm:pt-32">
        <p className="mb-6 font-mono text-xs tracking-wider text-muted-foreground">
          9AM STUDIOS · FIVEM NUI KIT
        </p>

        <h1 className="max-w-[16ch] text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl">
          Build your FiveM NUI.
          <br />
          <span className="text-muted-foreground">Copy in, don&apos;t install.</span>
        </h1>

        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
          {appDescription}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/docs"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 dark:text-background"
          >
            Documentation
          </Link>
          <Link
            href="/docs/components"
            className="inline-flex h-10 items-center rounded-lg border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Components
          </Link>
          <a
            href={githubUrl}
            className="inline-flex h-10 items-center px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub ↗
          </a>
        </div>

        <CopyCommand className="mt-6" command="bunx shadcn@latest add @9am/scaffold" />

        <p className="mt-3 text-xs text-muted-foreground">
          No token, no account —{" "}
          <Link href="/docs/getting-started/installation" className="underline hover:text-foreground">
            point components.json at it
          </Link>
          .
        </p>
      </section>

      {/* ---------------------------------------------------------- counts */}
      <section className="border-y">
        <div className="mx-auto grid w-full max-w-[820px] grid-cols-2 divide-x sm:grid-cols-4">
          {[
            [total, "registry items"],
            [components.length, "primitives"],
            [icons.length, "animated icons"],
            ["103", "Chromium, handled"],
          ].map(([value, label]) => (
            <div key={String(label)} className="px-6 py-7">
              <div className="font-display text-2xl text-foreground">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- props */}
      <section className="mx-auto w-full max-w-[820px] px-6 py-20">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {PROPS.map((prop) => (
            <div key={prop.title}>
              <h2 className="text-sm font-medium text-foreground">{prop.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {prop.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- component */}
      <section className="border-t">
        <div className="mx-auto w-full max-w-[820px] px-6 py-20">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl text-foreground">Components</h2>
            <Link
              href="/docs/components"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              All {components.length} →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {components.map((item) => (
              <Link
                key={item.name}
                href={`/docs/components/${item.name}`}
                className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground no-underline transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {item.title ?? item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- footer */}
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-[820px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground">
          <span>
            Extracted from <code className="font-mono">9am-vehicleshop</code> v1.2.8,
            consumer #0.
          </span>
          <div className="flex gap-5">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <Link href="/docs/registry" className="hover:text-foreground">
              Registry
            </Link>
            <a href={githubUrl} className="hover:text-foreground">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
