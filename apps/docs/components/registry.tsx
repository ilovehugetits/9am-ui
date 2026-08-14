import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { getComponents, getItem, getItems, isIcon, type RegistryItem } from "@/lib/registry";

/**
 * Everything on this page that describes an item — its install command, what
 * files it writes, what it drags in — is read from `registry.json` at build
 * time. Typing it into MDX instead would give the docs their own copy of facts
 * that `bun run registry:gen` regenerates from the components themselves.
 */

function shortName(dep: string) {
  return dep.replace(/^@9am\//, "");
}

/** `@9am/icon-users` -> a docs link, if we have a page for it. */
function depHref(dep: string): string {
  const name = shortName(dep);
  if (name.startsWith("icon-")) return "/docs/components/icons";
  const nonComponent: Record<string, string> = {
    utils: "/docs/lib/utils",
    "smooth-scroll": "/docs/lib/smooth-scroll",
    i18n: "/docs/nui/i18n",
    nui: "/docs/nui/nui",
    "use-theme": "/docs/nui/use-theme",
    visibility: "/docs/nui/visibility",
    navigation: "/docs/nui/navigation",
    theme: "/docs/theme",
    fonts: "/docs/getting-started/fonts",
  };
  return nonComponent[name] ?? `/docs/components/${name}`;
}

export function Install({ name }: { name: string }) {
  const item = getItem(name);
  if (!item) throw new Error(`No registry item named "${name}" — check registry.json.`);

  return (
    <div className="my-6 space-y-4">
      <DynamicCodeBlock lang="bash" code={`bunx shadcn@latest add @9am/${name}`} />
      <ItemDependencies item={item} />
    </div>
  );
}

function ItemDependencies({ item }: { item: RegistryItem }) {
  const registryDeps = item.registryDependencies ?? [];
  const npmDeps = item.dependencies ?? [];

  if (registryDeps.length === 0 && npmDeps.length === 0) {
    return (
      <p className="not-prose text-sm text-muted-foreground">
        Standalone — no other registry items and no npm packages.
      </p>
    );
  }

  return (
    <div className="not-prose grid gap-4 text-sm sm:grid-cols-2">
      {registryDeps.length > 0 && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Pulls in automatically
          </div>
          <ul className="m-0 list-none space-y-1 p-0">
            {registryDeps.map((dep) => (
              <li key={dep} className="m-0">
                <Link
                  href={depHref(dep)}
                  className="font-mono text-xs text-primary no-underline hover:underline"
                >
                  {dep}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {npmDeps.length > 0 && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            npm packages
          </div>
          <ul className="m-0 list-none space-y-1 p-0">
            {npmDeps.map((dep) => (
              <li key={dep} className="m-0 font-mono text-xs text-muted-foreground">
                {dep}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** The files `shadcn add` writes into a consumer project. */
export function ItemFiles({ name }: { name: string }) {
  const item = getItem(name);
  if (!item?.files?.length) return null;

  return (
    <ul className="text-sm">
      {item.files.map((file) => (
        <li key={file.path}>
          <code>{file.target ?? file.path.replace(/^registry\//, "components/")}</code>
        </li>
      ))}
    </ul>
  );
}

/** Card grid of every documented component. Used on the components index. */
export function ComponentGrid() {
  const components = getComponents();

  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      {components.map((item) => (
        <Link
          key={item.name}
          href={`/docs/components/${item.name}`}
          className="group rounded-lg border bg-card p-4 no-underline transition-colors hover:border-primary/50"
        >
          <div className="font-display text-base text-foreground">
            {item.title ?? item.name}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
          <code className="mt-2 block text-xs text-primary/80">@9am/{item.name}</code>
        </Link>
      ))}
    </div>
  );
}

/** The complete manifest, as a table. */
export function RegistryTable({ filter }: { filter?: "ui" | "icons" | "other" }) {
  const items = getItems();

  const rows = items.filter((item) => {
    if (filter === "icons") return isIcon(item);
    if (filter === "ui") return item.type === "registry:ui" && !isIcon(item);
    if (filter === "other") return item.type !== "registry:ui";
    return true;
  });

  return (
    <table className="text-sm">
      <thead>
        <tr>
          <th>Item</th>
          <th>Type</th>
          <th>What it is</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.name}>
            <td className="whitespace-nowrap font-mono text-xs">@9am/{item.name}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">
              {item.type.replace("registry:", "")}
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Count badge used in prose, so "84 items" can never go stale. */
export function ItemCount({ filter }: { filter?: "ui" | "icons" | "all" }) {
  const items = getItems();
  if (filter === "icons") return <>{items.filter(isIcon).length}</>;
  if (filter === "ui")
    return <>{items.filter((i) => i.type === "registry:ui" && !isIcon(i)).length}</>;
  return <>{items.length}</>;
}
