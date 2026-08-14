import { exampleSources, registry } from "./data.generated";
import type { RegistryItem } from "./registry-types";

export type { RegistryFile, RegistryItem } from "./registry-types";

/**
 * Read access to the registry manifest.
 *
 * Every "install this" block, dependency list and file table in the docs is
 * derived from `registry.json` rather than typed into MDX. The manifest is
 * generated from the components themselves by `bun run registry:gen`, so the
 * docs cannot be wrong about a component's dependencies without `r/` being
 * wrong too — which consumers would notice first.
 */

export function getItems(): RegistryItem[] {
  return registry.items;
}

export function getItem(name: string): RegistryItem | undefined {
  return registry.items.find((item) => item.name === name);
}

/** Icons are `registry:ui` too; they are told apart by the `icon-` prefix. */
export function isIcon(item: RegistryItem): boolean {
  return item.name.startsWith("icon-");
}

export function getComponents(): RegistryItem[] {
  return getItems().filter((i) => i.type === "registry:ui" && !isIcon(i));
}

export function getIcons(): RegistryItem[] {
  return getItems().filter(isIcon);
}

/**
 * The source of an example, keyed by its path under `apps/docs/examples`.
 *
 * Throws rather than rendering an empty Code tab: a missing example means the
 * MDX references a file that does not exist, and that should fail the build.
 */
export function getExampleSource(name: string): string {
  const source = exampleSources[name];
  if (source === undefined) {
    throw new Error(
      `No example at apps/docs/examples/${name}.tsx. Known examples: ${Object.keys(exampleSources).join(", ")}`,
    );
  }
  return source;
}
