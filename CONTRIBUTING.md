# Contributing to 9AM UI

Outside contributions are welcome. Fork, branch, open a PR — `main` is
protected, so that is the only route in.

## The short version

```bash
bun install
# … make your change …
bun run build        # regenerates registry.json and r/ — COMMIT THE RESULT
bun run typecheck
bun run preview      # eyeball it in both themes
```

`bun run build` is the step people forget. `r/` is committed on purpose — it is
what `raw.githubusercontent.com` serves to consumers — so CI rebuilds it and
fails the PR if your commit does not match what the sources generate. The error
tells you exactly what to run.

## What CI checks

Three jobs run on every PR, all required before merge:

| Job | What it does |
|---|---|
| `verify` | typecheck, preview build, then rebuilds `r/` and fails if the committed copy is stale |
| `docs` | builds the docs site, so a broken MDX reference cannot merge |
| `cli` | bundles the CLI and runs it **under node**, which is what keeps `npx 9am-ui` working |

None of them need secrets, so they run normally on PRs from forks.

## Layout

```
registry/
  theme/      9am-theme.css (locked), 9am-fonts.css (generated), fonts/*.woff2
  lib/        cn(), smooth-scroll
  nui/        fetchNui, useNuiEvent, misc, debugData, useTheme,
              VisibilityProvider, nui.config.ts, vite-env.d.ts
  i18n/       runtime dictionary from Lua
  ui/         19 primitives
  icons/      47 animated icons
  scaffold/   web/ + lua/ — the new-script starting point
r/            BUILT registry JSON — committed, served by raw.githubusercontent
apps/preview/ gallery, imports straight out of registry/
cli/          9am-ui check | doctor | lua
scripts/      build-fonts.ts, build-registry.ts
```

`registry.json` is **generated** — never hand-edit it. `scripts/build-registry.ts` derives every item's `dependencies` and `registryDependencies` from the actual import graph, so the manifest cannot disagree with the code.

## Adding a component

1. Drop the file in `registry/ui/` (or `registry/icons/` if it exposes the `startAnimation()` handle).
2. Import using the consumer-facing aliases, never relative paths across directories:
   - `@/lib/utils`, `@/components/ui/button`, `@/hooks/useNuiEvent`, `@/utils/fetchNui`, `@/i18n`
   That is what the file will resolve to once installed; a relative path that works here will break there.
3. If it needs a new npm package, add it to the root `package.json` first — the generator errors out on an import it can't find a version for.
4. Show it in `apps/preview/src/Gallery.tsx`. Icons appear automatically (globbed).
5. `bun run build && bun run typecheck && bun run preview`

## Adding a user-facing string

Kit components must not hardcode English. Use `t("ui.common.…")` and add the English fallback to `KIT_DEFAULTS` in `registry/i18n/index.ts` **and** to `registry/scaffold/lua/locales/en.json`.

If a string is domain-specific rather than generic, take it as a prop instead — see `countLabel` on `DataTable`, which exists so a coupon table can say "12 coupons" while the default stays "12 rows".

## Touching the theme

Token changes land in every 9AM script, so they are the highest-blast-radius change in the repo.

- Edit `registry/theme/9am-theme.css`.
- Check both palettes in the preview. Light mode is not a tint of dark mode: `--primary` is a deliberately deeper amber there, chosen so `text-primary` stays legible on white without per-component overrides.
- Never author a colour outside the token set. A raw hex in a component is drift that `check` cannot see.

Fonts: replace the woff2 in `registry/theme/fonts/`, run `bun run fonts`. Never edit `9am-fonts.css` — it is generated.

## Conventions worth keeping

- **Translucent fills, not solid greys.** `bg-black/[0.05] dark:bg-white/10` is the raised-control surface. Hairlines are `border-black/10 dark:border-white/10`.
- **Gold tint for accent states** — `bg-[#F6E3711a]`.
- **`active:scale-95`** on anything clickable.
- **Phudu for display, Poppins for body.** `!font-[phudu]` on headings and the `navigation` button variant.
- **Comments explain the non-obvious**, especially CEF workarounds. Several existing comments are in Turkish; match the file you are editing rather than mass-translating.

## CEF constraints

Chromium 103. No `:has()`, no `@container`, no `oklch()` at runtime, no `mask` on `backdrop-filter` output, and no wheel-scrolling of `clip-path`'d containers. Before reaching for a modern CSS feature, check it against 103 — the preview runs in a current browser and will happily lie to you.

## Release

Releasing is a version bump. Nothing else publishes.

1. Bump `version` in `package.json`.
2. Merge to `main`.
3. Once `ci` goes green, the `release` workflow publishes `9am-ui` to npm,
   tags the commit and opens a GitHub Release with generated notes.

Any other merge to `main` — a component fix, docs, a README typo — builds and
verifies but publishes nothing, because the version already matches npm.

Two properties worth knowing:

- **Release is gated on `ci`.** It triggers on `ci` completing successfully,
  not on the push, so a red commit cannot reach npm.
- **There is no npm token.** Publishing authenticates over OIDC against a
  trusted publisher configured on the package, which is also what attaches the
  provenance badge. Nothing to rotate, nothing to leak.

Consumers are unaffected either way until they run `shadcn add … --overwrite`.
The registry `r/` is served from `main`, so a merge updates it immediately —
the npm version only governs the CLI.
