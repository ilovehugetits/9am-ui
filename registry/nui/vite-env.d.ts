/// <reference types="vite/client" />

export {}

// FiveM NUI globals injected by the CEF host. Optional because the app also
// runs as a plain browser page (bun run start) where neither is defined.
declare global {
  interface Window {
    invokeNative?: (...args: unknown[]) => void
    GetParentResourceName?: () => string
  }

  /** Compile-time flag from vite.config.ts `define`: true everywhere except
   *  `bun run production-build`, where dev-seed/mock-data paths are stripped. */
  const __DEV_SEED__: boolean
}
