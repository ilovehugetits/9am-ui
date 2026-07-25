#!/usr/bin/env node
/**
 * 9am-ui — drift check for a script using the 9AM UI registry.
 *
 *   bun src/scripts/9am-ui.mjs check    compare installed kit files to the registry
 *   bun src/scripts/9am-ui.mjs doctor   verify auth, theme import and CEF css setup
 *
 * Zero dependencies, and deliberately NOT a package. Bun resolves `github:` and
 * `git+https:` dependencies through the GitHub tarball API, which 404s on a
 * private repo unless you hand it a second set of credentials — so making this
 * an installable dep would mean every developer and CI job configuring auth
 * twice. Instead it ships through the registry like any other item and reuses
 * the token already in components.json.
 *
 * Enforcement is asymmetric on purpose. Identical tokens are what make the
 * scripts read as siblings, so theme/font drift fails. A component tweaked
 * locally is reported but allowed: teams need that escape hatch, they just
 * shouldn't get it silently.
 *
 * Run from the directory holding components.json (your web/), or pass --dir.
 */
import fs from "node:fs";
import path from "node:path";

const RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m", RST = "\x1b[0m";

/** Drift here is a hard failure — these carry the shared visual identity. */
const LOCKED_ITEMS = new Set(["theme", "fonts"]);
/** A starting point, not a managed artifact. */
const UNMANAGED_ITEMS = new Set(["scaffold", "tools"]);
/** Meant to be edited per script. */
const EDITABLE = new Set(["src/nui.config.ts"]);

/** Line endings are not drift: git checkouts differ across machines. */
const norm = (s) => s.replace(/\r\n/g, "\n").replace(/\s+$/, "");

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (n) => { const i = argv.indexOf(n); return i > -1 ? argv[i + 1] : undefined; };
const ROOT = path.resolve(flag("--dir") ?? ".");

// ------------------------------------------------------------------- config

function loadConfig() {
  const cj = path.join(ROOT, "components.json");
  if (!fs.existsSync(cj)) {
    console.error(`${RED}✖${RST} no components.json in ${ROOT}`);
    console.error(`  ${DIM}run this from your web/ directory, or pass --dir <path>${RST}`);
    process.exit(1);
  }
  const components = JSON.parse(fs.readFileSync(cj, "utf8"));
  const reg = components.registries?.["@9am"];
  if (!reg?.url) {
    console.error(`${RED}✖${RST} components.json has no @9am registry`);
    process.exit(1);
  }

  // Expand ${ENV_VAR} the same way shadcn does.
  const expand = (s) => s.replace(/\$\{(\w+)\}/g, (_, k) => process.env[k] ?? "");
  const headers = Object.fromEntries(
    Object.entries(reg.headers ?? {}).map(([k, v]) => [k, expand(String(v))]),
  );

  // "@/*" alias -> real directory.
  let srcDir = "src";
  const tsconfig = path.join(ROOT, "tsconfig.json");
  if (fs.existsSync(tsconfig)) {
    try {
      const raw = fs.readFileSync(tsconfig, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      const p = JSON.parse(raw)?.compilerOptions?.paths?.["@/*"];
      if (Array.isArray(p) && p[0]) srcDir = p[0].replace(/^\.\//, "").replace(/\/\*$/, "");
    } catch { /* src/ */ }
  }
  return { url: reg.url, headers, srcDir, tokenName: JSON.stringify(reg.headers ?? {}).match(/\$\{(\w+)\}/)?.[1] };
}

const cfg = loadConfig();
const itemUrl = (name) => cfg.url.replace("{name}", name);

async function fetchItem(name) {
  const res = await fetch(itemUrl(name), { headers: cfg.headers });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}${res.status === 404 ? " (bad token, or item does not exist)" : ""}`);
  return res.json();
}

/** Where a registry file lands in this project. */
function targetOf(file) {
  if (file.target) return file.target;
  const base = path.basename(file.path);
  const sub = file.type === "registry:lib" ? "lib" : file.type === "registry:hook" ? "hooks" : "components/ui";
  return path.posix.join(cfg.srcDir, sub, base);
}

// -------------------------------------------------------------------- check

async function check() {
  const index = await fetchItem("registry");

  // Only fetch items that are actually installed here — a script using three
  // components shouldn't pull all 75.
  const present = index.items
    .filter((i) => !UNMANAGED_ITEMS.has(i.name))
    .map((i) => ({ name: i.name, files: (i.files ?? []).map(targetOf).filter((t) => !EDITABLE.has(t)) }))
    .map((i) => ({ ...i, files: i.files.filter((t) => fs.existsSync(path.join(ROOT, t))) }))
    .filter((i) => i.files.length);

  if (!present.length) {
    console.log(`${YEL}⚠${RST} no 9AM kit files found in ${ROOT}\n`);
    process.exit(0);
  }

  const locked = [], drift = [];
  let count = 0;

  const results = await Promise.all(
    present.map(async (i) => ({ name: i.name, item: await fetchItem(i.name) })),
  );

  for (const { name, item } of results) {
    for (const file of item.files ?? []) {
      const rel = targetOf(file);
      if (EDITABLE.has(rel)) continue;
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) continue;
      count++;
      if (norm(fs.readFileSync(abs, "utf8")) === norm(file.content)) continue;
      (LOCKED_ITEMS.has(name) ? locked : drift).push(`${rel}  ${DIM}(@9am/${name})${RST}`);
    }
  }

  console.log(`${DIM}9am-ui check — ${count} kit file(s) installed${RST}\n`);

  if (locked.length) {
    console.log(`${RED}✖ theme drift — the shared design tokens have been edited locally${RST}`);
    locked.forEach((f) => console.log(`    ${f}`));
    console.log(`\n  ${DIM}Identical tokens are what make 9AM scripts look like siblings.`);
    console.log(`  Restore:  bunx shadcn@latest add @9am/theme @9am/fonts --overwrite`);
    console.log(`  If the change is intentional, make it in 9am-ui and release it.${RST}\n`);
  }
  if (drift.length) {
    console.log(`${YEL}⚠ ${drift.length} component(s) differ from the registry${RST}`);
    drift.forEach((f) => console.log(`    ${f}`));
    console.log(`\n  ${DIM}Allowed — but a local fix helps nobody else. Consider upstreaming it.${RST}\n`);
  }
  if (!locked.length && !drift.length) console.log(`${GRN}✔ no drift${RST}\n`);

  process.exit(locked.length ? 1 : 0);
}

// ------------------------------------------------------------------- doctor

async function doctor() {
  const problems = [];
  const ok = (m) => console.log(`  ${GRN}✔${RST} ${m}`);
  const bad = (m, fix) => { console.log(`  ${RED}✖${RST} ${m}`); console.log(`      ${DIM}${fix}${RST}`); problems.push(m); };

  console.log(`${DIM}9am-ui doctor — ${ROOT}${RST}\n`);

  ok(`@9am registry -> ${cfg.url}`);
  if (!cfg.tokenName) bad("@9am registry has no auth header", "a private repo needs Authorization: Bearer ${TOKEN}");
  else if (!process.env[cfg.tokenName]) bad(`${cfg.tokenName} is not set in this shell`, `export ${cfg.tokenName}=<github PAT with read access to 9am-ui>`);
  else {
    try {
      await fetchItem("registry");
      ok(`${cfg.tokenName} is set and the registry is reachable`);
    } catch (e) {
      bad(`registry unreachable — ${e.message}`, "check the token has read access to ilovehugetits/9am-ui");
    }
  }

  const cssPath = path.join(ROOT, cfg.srcDir, "index.css");
  if (!fs.existsSync(cssPath)) bad(`${cfg.srcDir}/index.css not found`, "the theme is imported from your entry stylesheet");
  else {
    const css = fs.readFileSync(cssPath, "utf8");
    if (css.includes("9am-theme.css")) ok("index.css imports the 9AM theme");
    else bad("index.css does not import the 9AM theme", 'add: @import "./styles/9am-theme.css";');

    if (css.includes("9am-fonts-linked.css")) ok("fonts: linked (multi-entry safe)");
    else if (css.includes("9am-fonts.css")) ok("fonts: embedded base64");
    else bad("index.css imports no 9AM font stylesheet", 'add: @import "./styles/9am-fonts.css";');
  }

  const post = path.join(ROOT, "postcss.config.js");
  if (!fs.existsSync(post)) bad("postcss.config.js not found", "required: it converts oklch to a CEF-safe format");
  else if (!fs.readFileSync(post, "utf8").includes("postcss-color-converter"))
    bad("postcss.config.js is missing postcss-color-converter", "without it the oklch tokens die in CEF 103 — the UI renders unstyled in-game");
  else ok("postcss oklch conversion configured");

  const dist = path.join(ROOT, "dist", "assets");
  if (fs.existsSync(dist)) {
    const bad2 = fs.readdirSync(dist).filter((f) => f.endsWith(".css") && fs.readFileSync(path.join(dist, f), "utf8").includes("oklch("));
    if (bad2.length) bad(`built CSS still contains oklch(): ${bad2.join(", ")}`, "CEF 103 cannot parse it — check postcss.config.js");
    else ok("built CSS is free of oklch()");
  }

  console.log();
  if (problems.length) { console.log(`${RED}${problems.length} problem(s) found${RST}\n`); process.exit(1); }
  console.log(`${GRN}✔ all good${RST}\n`);
  process.exit(0);
}

// --------------------------------------------------------------------- main

const run = cmd === "check" ? check : cmd === "doctor" ? doctor : null;
if (!run) {
  console.log(`9am-ui — drift check for the 9AM UI registry

  ${GRN}check${RST}   [--dir <web>]   compare installed kit files against the registry
  ${GRN}doctor${RST}  [--dir <web>]   verify auth, theme import and CEF css setup

Setup commands (lua scaffold, linked fonts) live in the 9am-ui repo itself:
  bun <path-to-9am-ui>/cli/index.ts lua|fonts
`);
  process.exit(cmd ? 1 : 0);
}
run().catch((e) => { console.error(`${RED}✖${RST} ${e.message}`); process.exit(1); });
