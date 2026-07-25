# 9AM UI

The shared design language, NUI plumbing and FiveM CEF workarounds behind every 9AM Studios script.

Distributed as a **private [shadcn registry](https://ui.shadcn.com/docs/registry)**: components are copied into each script rather than imported from a package, so a script can diverge when it genuinely needs to — while `9am-ui check` makes sure nobody diverges by accident.

Extracted from `9am-vehicleshop` v1.2.8, which is consumer #0.

---

## What's in it

| Layer | Items | What it gives you |
|---|---|---|
| **Theme** | `@9am/theme` | OKLCH tokens for both palettes, the `primary-50…950` ramp, radius scale, class-driven `dark:` variant, Poppins + Phudu embedded as base64, and the NUI base rules (transparent body, suppressed focus rings, scrollbar utilities). **Locked** — see [Drift policy](#drift-policy). |
| **Primitives** | 19 items | `button` (8 variants), `card`, `input`, `label`, `field`, `select`, `multi-select`, `switch`, `separator`, `table`, `data-table`, `tabs`, `dialog`, `popover`, `tooltip`, `info-tip`, `calendar`, `chart`, `viewport` |
| **Icons** | 47 items | `@9am/icon-*` — hand-built animated SVGs, no icon library dependency. Each exposes `startAnimation()`/`stopAnimation()` through a ref so a parent (a tab, a table row) can drive it. |
| **NUI** | `@9am/nui`, `@9am/visibility`, `@9am/use-theme`, `@9am/i18n` | `fetchNui`, `useNuiEvent`, `debugData`, browser-dev detection, frame visibility with ESC + focus release, theme store, and runtime i18n pulled from Lua. |
| **Lib** | `@9am/utils`, `@9am/smooth-scroll` | `cn()`, and the global wheel handler that repairs scrolling in CEF. |
| **Scaffold** | `@9am/scaffold` + `9am-ui lua` | A whole new script's UI: vite/tsconfig/eslint/postcss, `index.html`, `main.tsx`, starter `App`, plus the Lua side. |

Browse it all: `bun run preview` → <http://localhost:5173>.

### The two pieces that matter most

**`@9am/viewport`** is the house scroll container: a drag-able custom scrollbar, layered "liquid glass" edge blur, and a header that blur-swaps to a sticky copy as you scroll. It also carries the CEF-103 workarounds — `clipPath` instead of `overflow`+radius, stacked fixed-blur bands because `mask` doesn't apply to `backdrop-filter` output, and JS-computed grid columns because `:has()` and `@container` don't exist in Chromium 103.

**`@9am/smooth-scroll`** exists because CEF will not wheel-scroll a `clip-path`'d container at all. Without it, the viewport is unscrollable in-game while working fine in your browser.

---

## Setup (once per machine)

The registry is private, so `shadcn` needs a token.

1. Create a GitHub PAT with **read access to `ilovehugetits/9am-ui`**.
2. Export it (add to your shell profile so it survives a reboot):

```bash
export NINEAM_UI_TOKEN=github_pat_xxxxxxxx
```

---

## Use it in a new script

```bash
mkdir -p my-script/web && cd my-script/web
bun init -y
```

Add `components.json`:

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york", "rsc": false, "tsx": true,
  "tailwind": {
    "config": "", "css": "src/index.css",
    "baseColor": "neutral", "cssVariables": true, "prefix": ""
  },
  "aliases": {
    "components": "@/components", "utils": "@/lib/utils",
    "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks"
  },
  "registries": {
    "@9am": {
      "url": "https://raw.githubusercontent.com/ilovehugetits/9am-ui/main/r/{name}.json",
      "headers": { "Authorization": "Bearer ${NINEAM_UI_TOKEN}" }
    }
  }
}
```

Then:

```bash
bunx shadcn@latest add @9am/scaffold     # web skeleton + every dependency
cd .. && bunx 9am-ui lua                 # Lua side, from the resource root
```

Finally, edit **`web/src/nui.config.ts`** — it is the one kit file you are meant to change:

```ts
export const nuiConfig = {
  resourceName: "my-script",
  themeStorageKey: "my-script:theme",
  defaultTheme: "dark",
}
```

Keep the `localStorage` key in `index.html` in sync with `themeStorageKey` (it runs before first paint to avoid a theme flash), then:

```bash
cd web && bun install && bun run build
bunx 9am-ui doctor    # confirms auth, theme import and the CEF css setup
```

## Use it in an existing script

Add the `registries` block above to your `components.json`, then take what you want:

```bash
bunx shadcn@latest add @9am/theme @9am/viewport @9am/data-table
```

Transitive dependencies resolve automatically — `@9am/data-table` pulls `button`, `input`, `table`, `i18n` and its three icons.

After adding `@9am/theme`, import it from your entry stylesheet:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./styles/9am-theme.css";
```

---

## Non-negotiables for CEF

FiveM's CEF is **Chromium 103**. Two things will silently ruin a build:

1. **`postcss.config.js` must keep `postcss-color-converter`.** The tokens are authored in `oklch()`, which CEF cannot parse. Without the conversion the UI renders completely unstyled in-game while looking perfect in `bun run start`. Verify with:
   ```bash
   bun run build && grep -c oklch dist/assets/*.css   # must be 0
   ```
2. **`installSmoothScroll()` must run in `main.tsx`.** Otherwise nothing scrolls in-game.

`bunx 9am-ui doctor` checks both, including scanning your built CSS for surviving `oklch()`.

---

## Drift policy

```bash
bunx 9am-ui check     # run from web/, wire it into CI
```

| What changed | Result |
|---|---|
| `src/styles/9am-theme.css` or `9am-fonts.css` | **Fails (exit 1).** Identical tokens are what make the scripts read as siblings. Restore with `bunx shadcn@latest add @9am/theme --overwrite`, or make the change here and release it. |
| Any component or icon | **Warns (exit 0).** Allowed — teams need the escape hatch — but a local fix helps nobody else. Consider upstreaming. |
| `src/nui.config.ts` | Ignored. It is supposed to differ. |
| Anything from `@9am/scaffold` | Ignored. A starting point, not a managed artifact. |

---

## Releasing a change

```bash
bun run build       # regenerates fonts, registry.json and r/
bun run typecheck
bun run preview     # eyeball it in both themes
git commit -am "feat(button): ..." && git push
```

`r/` is committed on purpose — `raw.githubusercontent.com` serves committed files, which is what lets a private repo act as a registry with no hosting at all.

Consumers pick the change up on their next `shadcn add ... --overwrite`. Nothing auto-updates; that is deliberate.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for adding a component.
