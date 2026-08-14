/**
 * Fail the build if any page prerendered as a 404.
 *
 * Next happily emits a route whose render called `notFound()` — the build
 * reports success, the route appears in the prerender manifest, and the page is
 * a 404 in production. A meta.json separator named the same as a sibling page
 * did exactly that here, and nothing in the build output said so.
 */
import fs from "node:fs/promises";
import path from "node:path";

const appDir = path.resolve(import.meta.dirname, "..");
const serverDir = path.join(appDir, ".next", "server", "app");

async function findMetaFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const found: string[] = [];

  for (const entry of entries) {
    const child = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.endsWith(".segments")) {
      found.push(...(await findMetaFiles(child)));
    } else if (entry.name.endsWith(".meta")) {
      found.push(child);
    }
  }

  return found;
}

/** Next's own error routes are supposed to have error statuses. */
const EXPECTED_ERROR_ROUTES = new Set(["_not-found", "_global-error", "_error"]);

const metas = await findMetaFiles(serverDir);
const broken: string[] = [];

for (const file of metas) {
  const name = path.basename(file, ".meta");
  if (EXPECTED_ERROR_ROUTES.has(name)) continue;

  const meta = JSON.parse(await fs.readFile(file, "utf8")) as { status?: number };
  if (meta.status && meta.status >= 400) {
    const route = path
      .relative(serverDir, file)
      .replace(/\\/g, "/")
      .replace(/\.meta$/, "");
    broken.push(`  ${meta.status}  /${route}`);
  }
}

if (broken.length > 0) {
  console.error(
    `\ncheck-build: ${broken.length} page(s) prerendered as an error:\n${broken.join("\n")}\n\n` +
      "A page that renders notFound() still builds. Usually a slug the loader " +
      "cannot resolve — check content/**/meta.json for a separator or entry " +
      "colliding with a filename.\n",
  );
  process.exit(1);
}

console.log(`check-build: ${metas.length} prerendered pages, none erroring`);
