/**
 * The CEF host globals the NUI layer feature-detects.
 *
 * `registry/nui/vite-env.d.ts` declares these for consumers, but it opens with
 * a `vite/client` reference that has no meaning in a Next app. Redeclaring the
 * two globals here keeps the docs typecheck honest without pulling Vite's
 * ambient types into a build that does not use Vite.
 */
declare global {
  interface Window {
    invokeNative?: (...args: unknown[]) => void;
    GetParentResourceName?: () => string;
  }
}

export {};
