<!--
Thanks for contributing. The checklist below is what CI enforces, so running
`bun run build && bun run typecheck` locally saves you a round trip.
-->

## What this changes

<!-- One or two sentences. What breaks today, or what is missing? -->

## Why

<!-- The reasoning a reviewer cannot infer from the diff. Especially valuable
     for CEF workarounds: say which Chromium 103 limitation forced your hand,
     or the next person will "simplify" it back into a bug. -->

## Checklist

- [ ] `bun run build` — regenerates `registry.json` and `r/`, **and the result is committed**
- [ ] `bun run typecheck` passes
- [ ] Checked in the preview (`bun run preview`) in **both** light and dark

If you touched a component or icon:

- [ ] Imports use consumer-facing aliases (`@/lib/utils`, `@/components/ui/*`), never relative paths across directories
- [ ] Any new npm dependency was added to the root `package.json` first
- [ ] Shown in `apps/preview/src/Gallery.tsx` (icons are picked up automatically)

If you touched the theme or fonts:

- [ ] I understand this lands in **every** 9AM script and hard-fails `9am-ui check` for anyone who has diverged
- [ ] Colours come from the token set — no raw hex

If you touched user-facing strings:

- [ ] Added to `KIT_DEFAULTS` in `registry/i18n/index.ts` **and** `registry/scaffold/lua/locales/en.json`

## Release

Leave the `version` in `package.json` alone unless you intend to publish.
Bumping it is what triggers the npm release once this merges.
