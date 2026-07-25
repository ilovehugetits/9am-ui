import { create } from "zustand";
import { fetchNui } from "@/utils/fetchNui";
import { isEnvBrowser } from "@/utils/misc";

/**
 * Runtime i18n for the NUI.
 *
 * Translations are NOT bundled: they live in the resource's locales/<lang>.json
 * files (customer-editable in the escrow build). On boot the app pulls the
 * dictionary from Lua via the `getLocale` NUI callback — Lua has already merged
 * the active language over English, so fallback is handled before it gets here.
 *
 * Resolution order for a key:
 *   1. the dictionary from Lua
 *   2. KIT_DEFAULTS below (English strings for the kit's own components)
 *   3. the key itself
 *
 * Step 2 exists so a freshly scaffolded script — or one whose locale file is
 * missing a key — renders "No results." rather than the raw string
 * "ui.common.noResults". Your own keys still go in locales/, as normal.
 *
 * Usage in components (reactive — re-renders when the dictionary arrives):
 *   const t = useT();
 *   <span>{t("ui.dashboard.stock.title")}</span>
 *   <span>{t("ui.catalog.priceFrom", { price: "50,000" })}</span>
 *
 * Outside components (event handlers, toasts, non-React modules) import the
 * plain `t` — but never call it at module scope: the dictionary loads async,
 * so translate at render/call time (turn static string constants into
 * functions or store keys and translate where they are displayed).
 */

export type LocaleDict = { [key: string]: string | LocaleDict };

/**
 * English fallbacks for every key the 9AM kit components reference themselves.
 * Copy these into your locales/en.json (and translate them elsewhere) if you
 * want them localised — the dictionary from Lua always wins over this table.
 */
export const KIT_DEFAULTS: LocaleDict = {
  ui: {
    common: {
      close: "Close",
      searchPlaceholder: "Search...",
      noResults: "No results.",
      noResultsFound: "No results found",
      selectPlaceholder: "Select...",
      nSelected: "{count} selected",
      rowCount: "{count} row(s)",
      pageOf: "Page {page} of {total}",
    },
  },
};

interface I18nState {
  locale: string;
  dict: LocaleDict;
}

export const useI18nStore = create<I18nState>(() => ({
  locale: "en",
  dict: {},
}));

/** Walk a dotted key path through a nested dictionary. */
function lookup(dict: LocaleDict, key: string): string | undefined {
  let node: LocaleDict | string | undefined = dict;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

export function t(
  key: string,
  vars?: Record<string, string | number>,
): string {
  const found =
    lookup(useI18nStore.getState().dict, key) ?? lookup(KIT_DEFAULTS, key);
  if (found === undefined) return key;
  if (!vars) return found;
  return found.replace(/\{(\w+)\}/g, (match, name: string) =>
    vars[name] !== undefined ? String(vars[name]) : match,
  );
}

/** Reactive `t` for components: subscribes to the store so the component
 *  re-renders when the dictionary is (re)loaded. */
export function useT() {
  useI18nStore((s) => s.dict);
  return t;
}

/**
 * Fetch the merged dictionary from Lua. Called once from main.tsx.
 *
 * @param devDict - Optional loader for browser dev mode (`bun run start`),
 *   where there is no Lua to ask. The kit deliberately does not hardcode the
 *   path to your locales — pass it from main.tsx, which knows where it lives:
 *
 *     initI18n(() => import("../../locales/en.json"));
 *
 *   Wrap the call site in `__DEV_SEED__` if you want the chunk stripped from
 *   production builds entirely.
 */
export async function initI18n(
  devDict?: () => Promise<{ default: unknown }>,
): Promise<void> {
  if (devDict && isEnvBrowser()) {
    const mod = await devDict();
    useI18nStore.setState({ locale: "en", dict: mod.default as LocaleDict });
    return;
  }
  const res = await fetchNui<{ locale: string; dict: LocaleDict }>("getLocale");
  if (res && typeof res === "object" && "dict" in res && res.dict) {
    useI18nStore.setState({ locale: res.locale, dict: res.dict });
  }
}
