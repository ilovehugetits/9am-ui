/**
 * 9am-ui — companion CLI for the 9AM UI registry.
 *
 *   bunx 9am-ui check     drift check against the registry (run in web/)
 *   bunx 9am-ui doctor    verify a consumer is wired up correctly
 *   bunx 9am-ui lua       write the Lua half of the scaffold (run in the resource root)
 *
 * This file is the source. What ships to npm is `dist/9am-ui.mjs`, bundled by
 * `bun run cli:build` so `npx 9am-ui` works too — node cannot execute the
 * TypeScript directly. Keep it free of Bun-only globals: it has to run on both.
 *
 * `check` compares what is actually on disk against the registry version this
 * CLI ships with — so it answers "does my copy match the kit I depend on?",
 * not "does it match whatever is on main right now".
 *
 * Enforcement is deliberately asymmetric. Identical tokens are what make the
 * scripts read as siblings, so theme drift is a hard failure. A component that
 * has been tweaked locally is reported but does not fail: teams need that
 * escape hatch, they just shouldn't get it silently.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FACES } from "../scripts/faces";

// `import.meta.dir` is Bun-only. This form works on both runtimes, and resolves
// to the package root from either location the file runs from: cli/index.ts
// under bun, or dist/9am-ui.mjs once bundled — both are one level down.
const PKG_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const R_DIR = path.join(PKG_ROOT, "r");
const LUA_DIR = path.join(PKG_ROOT, "registry", "scaffold", "lua");
const FONT_DIR = path.join(PKG_ROOT, "registry", "theme", "fonts");

const RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m", RST = "\x1b[0m";

/** Files a consumer is expected to edit — never reported as drift. */
const EDITABLE = new Set(["src/nui.config.ts"]);

/** The scaffold is a starting point, not a managed artifact: every file it
 *  writes is meant to be rewritten by the script that installed it. */
const UNMANAGED_ITEMS = new Set(["scaffold"]);

/** Drift here is a hard failure — these carry the shared visual identity. */
const LOCKED_ITEMS = new Set(["theme", "fonts"]);

/** Line endings are not drift: git checkouts differ across machines. */
const norm = (s: string) => s.replace(/\r\n/g, "\n").replace(/\s+$/, "");

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
}
const has = (flag: string) => process.argv.includes(flag);

// ---------------------------------------------------------------- resolution

interface Consumer {
  root: string;
  srcDir: string;
  components: Record<string, unknown>;
}

function loadConsumer(dir: string): Consumer {
  const root = path.resolve(dir);
  const cj = path.join(root, "components.json");
  if (!fs.existsSync(cj)) {
    console.error(`${RED}✖${RST} no components.json in ${root}`);
    console.error(`  ${DIM}run this from your web/ directory, or pass --dir <path>${RST}`);
    process.exit(1);
  }
  const components = JSON.parse(fs.readFileSync(cj, "utf8"));

  // Map the "@/*" TS path alias to a real directory; src/ is the convention.
  let srcDir = "src";
  const tsconfig = path.join(root, "tsconfig.json");
  if (fs.existsSync(tsconfig)) {
    try {
      const raw = fs.readFileSync(tsconfig, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      const paths = JSON.parse(raw)?.compilerOptions?.paths?.["@/*"];
      if (Array.isArray(paths) && paths[0]) srcDir = paths[0].replace(/^\.\//, "").replace(/\/\*$/, "");
    } catch {
      /* fall back to src/ */
    }
  }
  return { root, srcDir, components };
}

/** Where a registry file lands in a consumer project. */
function targetOf(file: { path: string; type: string; target?: string }, c: Consumer): string {
  if (file.target) return file.target;
  const base = path.basename(file.path);
  const sub = file.type === "registry:lib" ? "lib" : file.type === "registry:hook" ? "hooks" : "components/ui";
  return path.posix.join(c.srcDir, sub, base);
}

function registryItems(): Array<{ name: string; files: Array<{ path: string; type: string; target?: string; content: string }> }> {
  if (!fs.existsSync(R_DIR)) {
    console.error(`${RED}✖${RST} registry not built — run \`bun run build\` in 9am-ui`);
    process.exit(1);
  }
  return fs
    .readdirSync(R_DIR)
    .filter((f) => f.endsWith(".json") && f !== "registry.json" && f !== "index.json")
    .map((f) => JSON.parse(fs.readFileSync(path.join(R_DIR, f), "utf8")))
    .filter((i) => Array.isArray(i.files));
}

// -------------------------------------------------------------------- check

function check(dir: string): never {
  const c = loadConsumer(dir);
  const themeDrift: string[] = [];
  const drift: string[] = [];
  let installed = 0;

  for (const item of registryItems()) {
    if (UNMANAGED_ITEMS.has(item.name)) continue;
    for (const file of item.files) {
      const rel = targetOf(file, c);
      if (EDITABLE.has(rel)) continue;
      const abs = path.join(c.root, rel);
      if (!fs.existsSync(abs)) continue; // not installed — not this command's business
      installed++;
      if (norm(fs.readFileSync(abs, "utf8")) === norm(file.content)) continue;
      (LOCKED_ITEMS.has(item.name) ? themeDrift : drift).push(`${rel}  ${DIM}(@9am/${item.name})${RST}`);
    }
  }

  console.log(`${DIM}9am-ui check — ${installed} kit file(s) installed in ${path.relative(process.cwd(), c.root) || "."}${RST}\n`);

  if (themeDrift.length) {
    console.log(`${RED}✖ theme drift — the design tokens have been edited locally${RST}`);
    themeDrift.forEach((f) => console.log(`    ${f}`));
    console.log(`\n  ${DIM}Identical tokens are what make 9AM scripts look like siblings.`);
    console.log(`  Restore with:  bunx shadcn@latest add @9am/theme --overwrite`);
    console.log(`  If the change is intentional, make it in 9am-ui and release it.${RST}\n`);
  }

  if (drift.length) {
    console.log(`${YEL}⚠ ${drift.length} component(s) differ from the registry${RST}`);
    drift.forEach((f) => console.log(`    ${f}`));
    console.log(`\n  ${DIM}Allowed — but a local fix helps nobody else. Consider upstreaming it.${RST}\n`);
  }

  if (!themeDrift.length && !drift.length) console.log(`${GRN}✔ no drift${RST}\n`);

  process.exit(themeDrift.length ? 1 : 0);
}

// ------------------------------------------------------------------- doctor

function doctor(dir: string): never {
  const c = loadConsumer(dir);
  const problems: string[] = [];
  const ok = (m: string) => console.log(`  ${GRN}✔${RST} ${m}`);
  const bad = (m: string, fix: string) => {
    console.log(`  ${RED}✖${RST} ${m}`);
    console.log(`      ${DIM}${fix}${RST}`);
    problems.push(m);
  };

  console.log(`${DIM}9am-ui doctor — ${c.root}${RST}\n`);

  const registries = (c.components as { registries?: Record<string, { url?: string; headers?: Record<string, string> }> }).registries;
  const reg = registries?.["@9am"];
  if (!reg?.url) {
    bad("components.json has no @9am registry", 'add "registries": { "@9am": { "url": "https://raw.githubusercontent.com/ilovehugetits/9am-ui/main/r/{name}.json" } }');
  } else {
    ok(`@9am registry -> ${reg.url}`);
    // The registry is public, so headers are optional. One that references an
    // unset variable is still worth flagging: shadcn would send an empty
    // `Bearer `, and GitHub rejects a malformed credential rather than falling
    // back to an anonymous read.
    const tokenRef = JSON.stringify(reg.headers ?? {}).match(/\$\{(\w+)\}/)?.[1];
    if (!tokenRef) ok("no auth header needed — the registry is public");
    else if (!process.env[tokenRef]) {
      bad(`components.json sends Authorization from \${${tokenRef}}, which is not set in this shell`, `export ${tokenRef}=<github PAT>, or drop "headers" — the registry is public`);
    } else ok(`${tokenRef} is set`);
  }

  const cssPath = path.join(c.root, c.srcDir, "index.css");
  if (!fs.existsSync(cssPath)) {
    bad(`${c.srcDir}/index.css not found`, "the theme is imported from your entry stylesheet");
  } else {
    const css = fs.readFileSync(cssPath, "utf8");
    if (css.includes("9am-theme.css")) ok("index.css imports the 9AM theme");
    else bad("index.css does not import the 9AM theme", 'add: @import "./styles/9am-theme.css";');

    if (css.includes("9am-fonts-linked.css")) ok("fonts: linked (multi-entry safe)");
    else if (css.includes("9am-fonts.css")) ok("fonts: embedded base64");
    else bad("index.css imports no 9AM font stylesheet", 'add: @import "./styles/9am-fonts.css";  (or the linked variant)');
  }

  const post = path.join(c.root, "postcss.config.js");
  if (!fs.existsSync(post)) {
    bad("postcss.config.js not found", "required: it converts oklch to a CEF-safe format");
  } else if (!fs.readFileSync(post, "utf8").includes("postcss-color-converter")) {
    bad(
      "postcss.config.js is missing postcss-color-converter",
      "without it the oklch tokens die in CEF 103 — the UI renders unstyled in-game",
    );
  } else ok("postcss oklch conversion configured");

  const dist = path.join(c.root, "dist", "assets");
  if (fs.existsSync(dist)) {
    const withOklch = fs
      .readdirSync(dist)
      .filter((f) => f.endsWith(".css"))
      .filter((f) => fs.readFileSync(path.join(dist, f), "utf8").includes("oklch("));
    if (withOklch.length) bad(`built CSS still contains oklch(): ${withOklch.join(", ")}`, "CEF 103 cannot parse it — check postcss.config.js");
    else ok("built CSS is free of oklch()");
  }

  console.log();
  if (problems.length) {
    console.log(`${RED}${problems.length} problem(s) found${RST}\n`);
    process.exit(1);
  }
  console.log(`${GRN}✔ all good${RST}\n`);
  process.exit(0);
}

// ---------------------------------------------------------------------- lua

function lua(dir: string): never {
  const root = path.resolve(dir);
  const force = has("--force");
  const files: string[] = [];
  (function walk(d: string) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(path.relative(LUA_DIR, p).replace(/\\/g, "/"));
    }
  })(LUA_DIR);

  console.log(`${DIM}9am-ui lua — resource root: ${root}${RST}\n`);
  let written = 0,
    skipped = 0;
  for (const rel of files) {
    const dest = path.join(root, rel);
    if (fs.existsSync(dest) && !force) {
      console.log(`  ${YEL}skip${RST} ${rel} ${DIM}(exists — pass --force to overwrite)${RST}`);
      skipped++;
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(LUA_DIR, rel), dest);
    console.log(`  ${GRN}write${RST} ${rel}`);
    written++;
  }
  console.log(`\n${written} written, ${skipped} skipped.`);
  if (written) {
    console.log(`\n${DIM}Next: check fxmanifest.lua matches your file layout, and make sure`);
    console.log(`shared/locale.lua loads AFTER shared/config.lua (it reads Config.Locale).${RST}\n`);
  }
  process.exit(0);
}

// -------------------------------------------------------------------- fonts

/**
 * Writes the woff2 files plus a linked stylesheet next to the theme.
 *
 * `@9am/theme` embeds the fonts as base64 so it installs in one command, which
 * is right for a single-entry NUI. It is wrong for an app with several html
 * entries — especially one rendering DUI textures, where each DUI is a separate
 * CEF instance that would decode the entire base64 payload again with nothing
 * shared between them. Point those small entries at the linked stylesheet.
 */
function fonts(dir: string): never {
  const c = loadConsumer(dir);
  const outDir = path.join(c.root, c.srcDir, "styles");
  const fontOut = path.join(outDir, "fonts");
  fs.mkdirSync(fontOut, { recursive: true });

  for (const f of FACES) fs.copyFileSync(path.join(FONT_DIR, f.file), path.join(fontOut, f.file));

  const css = `/* --------------------------------------------------------------------------
   9AM UI — FONTS (linked)
   GENERATED by \`9am-ui fonts\`. DO NOT EDIT BY HAND.

   Same faces as 9am-fonts.css, referencing the woff2 files instead of
   embedding them. Import this from small/secondary entry points (DUI pages,
   standalone widgets) so they do not each carry the base64 payload.
   -------------------------------------------------------------------------- */

${FACES.map(
  ({ family, file, weight }) => `@font-face {
  font-family: '${family}';
  src: url('./fonts/${file}') format('woff2');
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`,
).join("\n\n")}
`;
  const cssPath = path.join(outDir, "9am-fonts-linked.css");
  fs.writeFileSync(cssPath, css);

  const rel = path.posix.join(c.srcDir, "styles");
  console.log(`${GRN}✔${RST} wrote ${FACES.length} woff2 to ${rel}/fonts/`);
  console.log(`${GRN}✔${RST} wrote ${rel}/9am-fonts-linked.css\n`);
  console.log(`${DIM}Import it from your secondary entry points, e.g.`);
  console.log(`  import './${rel}/9am-fonts-linked.css';${RST}\n`);
  process.exit(0);
}

// --------------------------------------------------------------------- main

const cmd = process.argv[2];
const dir = arg("--dir") ?? ".";

if (cmd === "check") check(dir);
if (cmd === "doctor") doctor(dir);
if (cmd === "lua") lua(dir);
if (cmd === "fonts") fonts(dir);

console.log(`9am-ui — companion CLI for the 9AM UI registry

  ${GRN}check${RST}   [--dir <web>]   compare installed kit files against the registry
  ${GRN}doctor${RST}  [--dir <web>]   verify the registry, theme import and CEF css setup
  ${GRN}lua${RST}     [--dir <root>]  write the Lua half of the scaffold [--force]
  ${GRN}fonts${RST}   [--dir <web>]   write linked woff2 + css for multi-entry apps
`);
process.exit(cmd ? 1 : 0);
