// DO NOT REMOVE postcss-color-converter.
//
// The 9AM theme tokens are authored in oklch (registry/theme/9am-theme.css).
// FiveM's CEF is Chromium 103, which does not understand `oklch()` — without
// this step every token resolves to nothing and the whole UI renders unstyled
// in-game while looking perfectly fine in `bun run start`. This converts them
// to a CEF-safe format at build time (Tailwind v4 separately emits hex
// fallbacks ahead of each `color-mix()` behind an `@supports` guard).
//
// Verify after changing anything here:
//   bun run build && grep -c oklch dist/assets/*.css   # must be 0
export default {
    plugins: {
        'postcss-color-converter': {
            outputColorFormat: 'rgb',
            ignore: ['hex']
        },
        '@tailwindcss/postcss': {},
        autoprefixer: {}
    }
}
