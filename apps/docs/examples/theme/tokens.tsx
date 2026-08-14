"use client";

/**
 * The semantic tokens and the primary ramp, read straight off the stylesheet.
 *
 * The ramp lives in `@theme inline`, which means Tailwind inlines the values
 * into utilities instead of emitting custom properties — `var(--color-primary-500)`
 * resolves to nothing. The swatches below reference the generated utilities,
 * spelled out in full so the class scanner can actually see them.
 */

const SEMANTIC = [
  "background",
  "foreground",
  "card",
  "popover",
  "primary",
  "primary-foreground",
  "secondary",
  "muted",
  "muted-foreground",
  "accent",
  "destructive",
  "border",
  "input",
  "ring",
];

const RAMP: [number, string][] = [
  [50, "bg-primary-50"],
  [100, "bg-primary-100"],
  [200, "bg-primary-200"],
  [300, "bg-primary-300"],
  [400, "bg-primary-400"],
  [500, "bg-primary-500"],
  [600, "bg-primary-600"],
  [700, "bg-primary-700"],
  [800, "bg-primary-800"],
  [900, "bg-primary-900"],
  [950, "bg-primary-950"],
];

export default function ThemeTokens() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          Semantic tokens
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {SEMANTIC.map((token) => (
            <div key={token} className="flex flex-col gap-1.5">
              <div
                className="h-12 rounded-lg border"
                style={{ background: `var(--${token})` }}
              />
              <span className="truncate text-[10px] text-muted-foreground">
                --{token}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          Primary ramp — theme-agnostic, identical in both palettes
        </div>
        <div className="flex overflow-hidden rounded-lg border">
          {RAMP.map(([step, className]) => (
            <div key={step} className={`${className} flex-1`}>
              <div className="flex h-14 items-end justify-center pb-1">
                <span className="text-[9px] text-neutral-500 mix-blend-difference">
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
