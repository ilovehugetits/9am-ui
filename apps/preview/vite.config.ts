import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const ROOT = path.resolve(__dirname, "../..")

/**
 * In a consumer project the primitives and the animated icons all live in one
 * directory (components/ui). Here they are kept apart for legibility, so
 * `@/components/ui/x` has to resolve across both — which a plain string alias
 * cannot express.
 */
function uiResolver(): Plugin {
  const dirs = [path.join(ROOT, "registry/ui"), path.join(ROOT, "registry/icons")]
  return {
    name: "9am-ui-resolver",
    enforce: "pre",
    resolveId(source) {
      const PREFIX = "@/components/ui/"
      if (!source.startsWith(PREFIX)) return null
      const base = source.slice(PREFIX.length)
      for (const dir of dirs) {
        const file = path.join(dir, `${base}.tsx`)
        if (fs.existsSync(file)) return file
      }
      return null
    },
  }
}

// The preview imports straight out of registry/ rather than from an installed
// copy — so a component that would break on `shadcn add` breaks here first.
export default defineConfig({
  root: __dirname,
  plugins: [uiResolver(), react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@/lib", replacement: path.join(ROOT, "registry/lib") },
      { find: "@/hooks", replacement: path.join(ROOT, "registry/nui") },
      { find: "@/utils", replacement: path.join(ROOT, "registry/nui") },
      { find: "@/providers", replacement: path.join(ROOT, "registry/nui") },
      { find: "@/nui.config", replacement: path.join(ROOT, "registry/nui/nui.config.ts") },
      { find: "@/i18n", replacement: path.join(ROOT, "registry/i18n/index.ts") },
    ],
  },
  define: { __DEV_SEED__: JSON.stringify(true) },
  build: { outDir: path.join(__dirname, "dist"), emptyOutDir: true },
})
