/**
 * Generates registry.json by reading the actual import graph under registry/.
 *
 * Hand-maintaining ~75 items is how a registry rots: someone adds an import and
 * forgets the matching `dependencies` entry, and `shadcn add` installs a
 * component whose package isn't there. Deriving both dependency lists from the
 * source means the manifest cannot disagree with the code.
 *
 *   bun run registry:gen     # rewrite registry.json
 *   bun run registry:build   # shadcn build → r/*.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dir, "..");
const REG = path.join(ROOT, "registry");

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const VERSIONS: Record<string, string> = pkg.dependencies;

/** Provided by the consumer app itself — never an item dependency. */
const AMBIENT = new Set(["react", "react-dom", "react/jsx-runtime"]);

/** Import specifier -> npm package name. */
function pkgOf(spec: string): string {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/");
  return spec.split("/")[0];
}

/** Where a `@/...` import lives, as a registry item name. */
function itemOf(spec: string): string | null {
  if (spec === "@/i18n") return "i18n";
  if (spec === "@/nui.config") return "nui";
  if (spec === "@/lib/utils") return "utils";
  if (spec === "@/lib/smooth-scroll") return "smooth-scroll";
  if (spec === "@/hooks/useTheme") return "use-theme";
  if (spec.startsWith("@/hooks/") || spec.startsWith("@/utils/")) return "nui";
  if (spec === "@/providers/NavigationProvider") return "navigation";
  if (spec.startsWith("@/providers/")) return "visibility";
  if (spec.startsWith("@/components/ui/")) {
    const base = spec.slice("@/components/ui/".length);
    return fs.existsSync(path.join(REG, "icons", `${base}.tsx`)) ? `icon-${base}` : base;
  }
  return null;
}

const IMPORT_RE = /(?:^|\n)\s*import\s+(?:type\s+)?(?:[\s\S]*?)\s*from\s*["']([^"']+)["']/g;

function scan(file: string) {
  const src = fs.readFileSync(file, "utf8");
  const deps = new Set<string>();
  const registryDeps = new Set<string>();
  for (const m of src.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (spec.startsWith("@/")) {
      const item = itemOf(spec);
      if (item) registryDeps.add(`@9am/${item}`);
      continue;
    }
    if (spec.startsWith(".")) continue;
    const p = pkgOf(spec);
    if (AMBIENT.has(p)) continue;
    if (!VERSIONS[p]) throw new Error(`${path.basename(file)} imports "${p}" which is not in package.json dependencies`);
    deps.add(`${p}@${VERSIONS[p]}`);
  }
  return { deps: [...deps].sort(), registryDeps: [...registryDeps].sort() };
}

const TITLES: Record<string, string> = {
  theme: "9AM Theme",
  fonts: "9AM Fonts (embedded)",
  tools: "Drift Check CLI",
  nui: "NUI Bridge",
  i18n: "Runtime i18n",
  visibility: "Visibility Provider",
  "use-theme": "Theme Hook",
  utils: "cn()",
  "smooth-scroll": "Smooth Scroll (CEF fix)",
  viewport: "Viewport",
  navigation: "Navigation Provider",
  scaffold: "Script Scaffold",
  "app-shell": "App Shell",
  "dashboard-header": "Dashboard Header",
  "page-transition": "Page Transition",
  "section-header": "Section Header",
  "stat-card": "Stat Card",
  "empty-state": "Empty State",
  "dashboard-scaffold": "Dashboard Scaffold",
};

const DESCRIPTIONS: Record<string, string> = {
  theme:
    "The 9AM design language: OKLCH token set for both palettes, the primary-50..950 ramp, radius scale, class-driven dark variant and the NUI base rules. Locked — `9am-ui check` fails on drift. Pair with @9am/fonts.",
  fonts:
    "Poppins + Phudu embedded as base64, so the theme installs with nothing else to fetch. Apps with several html entry points (DUI pages especially) should use `bunx 9am-ui fonts` for the linked variant instead.",
  tools:
    "Zero-dependency `check` / `doctor` script, installed to scripts/9am-ui.mjs. Reuses the registry token already in components.json, so there is no second set of credentials to configure. Wire `check` into CI.",
  nui: "fetchNui, useNuiEvent, debugData, isEnvBrowser and the per-script nui.config.ts.",
  i18n: "Runtime dictionary pulled from Lua via the getLocale callback, with English fallbacks for the kit's own strings.",
  visibility: "NUI frame visibility with ESC handling and focus release.",
  "use-theme": "Light/dark store that reflects onto <html> and persists per script.",
  utils: "The cn() class merger every component uses.",
  "smooth-scroll":
    "Global wheel-scroll handler. Repairs scrolling in FiveM CEF (Chromium 103 will not wheel-scroll clip-path'd containers) and gives every scroller the same eased feel.",
  viewport:
    "The 9AM scroll container: drag-able custom scrollbar, layered liquid-glass edges, and a header that blur-swaps to a sticky copy on scroll. Contains the CEF-103 compositing workarounds.",
  scaffold:
    "New-script web skeleton: vite/tsconfig/eslint/postcss (including the oklch conversion CEF requires), index.html, main.tsx and a starter App. Run `bunx 9am-ui lua` afterwards for the Lua half (NUI bridge, locale module, fxmanifest).",
  navigation:
    "Top-level page store driven by the `setPage` message, for scripts where Lua decides which screen opens. A single screen with tabs does not need it.",
  "app-shell":
    "The fixed 1280x720 centred panel every 9AM dashboard sits in. Fixed rather than fluid so the layout is identical at 1080p and ultrawide.",
  "dashboard-header":
    "Identity, centred animated tabs and an action cluster. Tabs are passed as data — the per-tab animation handle and three-state icon colour live inside, so adding a tab is one array entry.",
  "page-transition":
    "Cross-fade between dashboard pages: AnimatePresence in wait mode with the 9AM opacity/scale variants, tuned small enough to stay smooth in CEF.",
  "section-header":
    "The title row a subpage opens with: icon chip, Phudu title, optional action. Goes inside a ViewportTitle.",
  "stat-card":
    "Headline metric: icon chip, label, Phudu value and an optional trend line that picks its arrow and colour from a signed percentage.",
  "empty-state": "What a list renders instead of nothing, sized and muted to match across scripts.",
  "dashboard-scaffold":
    "Everything in @9am/scaffold plus a working dashboard: the shell, a header with animated tabs, page transitions and an example subpage built from section-header, stat-card and empty-state. Start here for anything with more than one screen.",
};

const titleize = (n: string) =>
  n.replace(/^icon-/, "").split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

type File = { path: string; type: string; target?: string };
type Item = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: File[];
};

const items: Item[] = [];

// ---- theme (locked) -------------------------------------------------------
items.push({
  name: "theme",
  type: "registry:file",
  title: TITLES.theme,
  description: DESCRIPTIONS.theme,
  dependencies: [`tailwindcss@${VERSIONS.tailwindcss}`, `tw-animate-css@${VERSIONS["tw-animate-css"]}`],
  files: [{ path: "registry/theme/9am-theme.css", type: "registry:file", target: "src/styles/9am-theme.css" }],
});

// Separate from the theme on purpose: 9am-theme.css does not import a font
// stylesheet, because which one you want is a per-app decision (base64 here,
// or the linked variant from `9am-ui fonts` for multi-entry apps). Bundling
// these into @9am/theme would push 322 KB onto consumers that don't use them.
items.push({
  name: "fonts",
  type: "registry:file",
  title: TITLES.fonts,
  description: DESCRIPTIONS.fonts,
  files: [{ path: "registry/theme/9am-fonts.css", type: "registry:file", target: "src/styles/9am-fonts.css" }],
});

// ---- tools ----------------------------------------------------------------
// Ships through the registry rather than as a package, so `shadcn add` stays
// the single install channel a consuming script needs and the tool version
// tracks the kit version it was pulled with.
items.push({
  name: "tools",
  type: "registry:file",
  title: TITLES.tools,
  description: DESCRIPTIONS.tools,
  // Lands at src/scripts/9am-ui.mjs: shadcn resolves registry:file targets
  // against the src root, and even the documented "~/" escape stays inside it.
  // Not worth fighting — vite only bundles what is imported and tsc ignores
  // .mjs, so a script living under src/ costs nothing.
  files: [{ path: "registry/tools/9am-ui.mjs", type: "registry:file", target: "scripts/9am-ui.mjs" }],
});

// ---- lib ------------------------------------------------------------------
for (const [name, file] of [["utils", "utils.ts"], ["smooth-scroll", "smooth-scroll.ts"]] as const) {
  const { deps } = scan(path.join(REG, "lib", file));
  items.push({
    name,
    type: "registry:lib",
    title: TITLES[name],
    description: DESCRIPTIONS[name],
    ...(deps.length ? { dependencies: deps } : {}),
    files: [{ path: `registry/lib/${file}`, type: "registry:lib" }],
  });
}

// ---- nui core -------------------------------------------------------------
const NUI_FILES: File[] = [
  { path: "registry/nui/nui.config.ts", type: "registry:file", target: "src/nui.config.ts" },
  { path: "registry/nui/misc.ts", type: "registry:file", target: "src/utils/misc.ts" },
  { path: "registry/nui/fetchNui.ts", type: "registry:file", target: "src/utils/fetchNui.ts" },
  { path: "registry/nui/debugData.ts", type: "registry:file", target: "src/utils/debugData.ts" },
  { path: "registry/nui/useNuiEvent.ts", type: "registry:hook" },
  { path: "registry/nui/vite-env.d.ts", type: "registry:file", target: "src/vite-env.d.ts" },
];
{
  const deps = new Set<string>();
  for (const f of NUI_FILES) scan(path.join(ROOT, f.path)).deps.forEach((d) => deps.add(d));
  items.push({
    name: "nui",
    type: "registry:file",
    title: TITLES.nui,
    description: DESCRIPTIONS.nui,
    ...(deps.size ? { dependencies: [...deps].sort() } : {}),
    files: NUI_FILES,
  });
}

// ---- single-file nui extras ----------------------------------------------
const EXTRAS: Array<[string, string, string, string | undefined]> = [
  ["use-theme", "registry/nui/useTheme.ts", "registry:hook", undefined],
  ["visibility", "registry/nui/VisibilityProvider.tsx", "registry:file", "src/providers/VisibilityProvider.tsx"],
  ["navigation", "registry/nui/NavigationProvider.tsx", "registry:file", "src/providers/NavigationProvider.tsx"],
  ["i18n", "registry/i18n/index.ts", "registry:file", "src/i18n/index.ts"],
];
for (const [name, file, type, target] of EXTRAS) {
  const { deps, registryDeps } = scan(path.join(ROOT, file));
  items.push({
    name,
    type: "registry:file",
    title: TITLES[name] ?? titleize(name),
    description: DESCRIPTIONS[name] ?? "",
    ...(deps.length ? { dependencies: deps } : {}),
    registryDependencies: [...new Set([...registryDeps, "@9am/nui"])].filter((d) => d !== `@9am/${name}`).sort(),
    files: [{ path: file, type, ...(target ? { target } : {}) }],
  });
}

// ---- ui primitives + icons ------------------------------------------------
for (const dir of ["ui", "icons"] as const) {
  for (const file of fs.readdirSync(path.join(REG, dir)).sort()) {
    const base = file.replace(/\.tsx$/, "");
    const name = dir === "icons" ? `icon-${base}` : base;
    const { deps, registryDeps } = scan(path.join(REG, dir, file));
    items.push({
      name,
      type: "registry:ui",
      title: TITLES[name] ?? titleize(name),
      description: DESCRIPTIONS[name] ?? (dir === "icons" ? `Animated ${titleize(base)} icon.` : `${titleize(base)} component.`),
      ...(deps.length ? { dependencies: deps } : {}),
      ...(registryDeps.length ? { registryDependencies: registryDeps.filter((d) => d !== `@9am/${name}`) } : {}),
      files: [{ path: `registry/${dir}/${file}`, type: "registry:ui" }],
    });
  }
}

// ---- scaffold -------------------------------------------------------------
const SCAFFOLD: File[] = [
  { path: "registry/scaffold/web/index.html", type: "registry:file", target: "index.html" },
  { path: "registry/scaffold/web/index.css", type: "registry:file", target: "src/index.css" },
  { path: "registry/scaffold/web/main.tsx", type: "registry:file", target: "src/main.tsx" },
  { path: "registry/scaffold/web/App.tsx", type: "registry:file", target: "src/components/App.tsx" },
  { path: "registry/scaffold/web/vite.config.ts", type: "registry:file", target: "vite.config.ts" },
  { path: "registry/scaffold/web/postcss.config.js", type: "registry:file", target: "postcss.config.js" },
  { path: "registry/scaffold/web/eslint.config.js", type: "registry:file", target: "eslint.config.js" },
  { path: "registry/scaffold/web/tsconfig.json", type: "registry:file", target: "tsconfig.json" },
  { path: "registry/scaffold/web/tsconfig.node.json", type: "registry:file", target: "tsconfig.node.json" },
];
// NOTE: the Lua half of the scaffold (fxmanifest, client/nui.lua,
// shared/locale.lua, locales/en.json) deliberately lives OUTSIDE this item.
// It belongs in the resource root, one level above the web project, and shadcn
// rejects any target containing ".." ("We found an unsafe file path ...").
// `bunx 9am-ui lua` writes those files instead — see cli/index.ts.
items.push({
  name: "scaffold",
  type: "registry:file",
  title: TITLES.scaffold,
  description: DESCRIPTIONS.scaffold,
  dependencies: [
    `@tailwindcss/vite@${VERSIONS["@tailwindcss/vite"]}`,
    `tailwindcss@${VERSIONS.tailwindcss}`,
    `tw-animate-css@${VERSIONS["tw-animate-css"]}`,
  ],
  registryDependencies: ["@9am/theme", "@9am/fonts", "@9am/nui", "@9am/i18n", "@9am/visibility", "@9am/use-theme", "@9am/utils", "@9am/smooth-scroll", "@9am/viewport", "@9am/button", "@9am/icon-x", "@9am/icon-theme-toggle"],
  files: SCAFFOLD,
});

// ---- dashboard scaffold ---------------------------------------------------
// Layers on top of @9am/scaffold rather than duplicating it: shadcn installs
// registryDependencies before the item's own files, so the App.tsx below wins
// over the starter one @9am/scaffold writes to the same target.
{
  const DASHBOARD_SCAFFOLD: File[] = [
    { path: "registry/dashboard-scaffold/App.tsx", type: "registry:file", target: "src/components/App.tsx" },
    { path: "registry/dashboard-scaffold/Overview.tsx", type: "registry:file", target: "src/components/pages/Overview.tsx" },
  ];
  const deps = new Set<string>();
  const registryDeps = new Set<string>(["@9am/scaffold"]);
  for (const f of DASHBOARD_SCAFFOLD) {
    const s = scan(path.join(ROOT, f.path));
    s.deps.forEach((d) => deps.add(d));
    s.registryDeps.forEach((d) => registryDeps.add(d));
  }
  items.push({
    name: "dashboard-scaffold",
    type: "registry:file",
    title: TITLES["dashboard-scaffold"],
    description: DESCRIPTIONS["dashboard-scaffold"],
    ...(deps.size ? { dependencies: [...deps].sort() } : {}),
    registryDependencies: [...registryDeps].sort(),
    files: DASHBOARD_SCAFFOLD,
  });
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "9am",
  homepage: "https://github.com/ilovehugetits/9am-ui",
  items,
};

fs.writeFileSync(path.join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json: ${items.length} items`);
