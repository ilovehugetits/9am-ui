import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => {
  // `bun run production-build` → mode "prod": customer-ready dist with the
  // browser dev seed / mock data compiled out and console noise stripped.
  const isProd = mode === "prod"

  return {
    // Relative base: the NUI is loaded from a file path, not a web root.
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // postcss.config.js holds the oklch→CEF-safe conversion. Do not drop it.
    css: {
      postcss: './postcss.config.js'
    },
    // Compile-time flag: false in production-build, which dead-code-eliminates
    // every dev-seed/mock-data path — their chunks are never emitted to dist.
    define: {
      __DEV_SEED__: JSON.stringify(!isProd),
    },
    esbuild: isProd
      ? {
          // Strip log/info/debug/warn calls; console.error stays (support
          // diagnostics when a customer reports a UI crash).
          pure: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          drop: ['debugger'],
        }
      : undefined,
    build: {
      rollupOptions: {
        // Add more HTML entry points here (a phone app, a DUI texture page…):
        //   input: { main: 'index.html', phone: 'phone.html' }
        output: {
          // Split heavyweight vendors out of the entry chunk: smaller files
          // parse faster in CEF and vendor chunks stay byte-identical between
          // releases (better caching, smaller diffs). Exact package matching —
          // substring matching pulls stray packages across groups and creates
          // circular chunks (TDZ crashes at runtime).
          manualChunks(id) {
            const m = id.replace(/\\/g, '/').match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)
            if (!m) return
            const pkg = m[1]
            if (pkg === 'react' || pkg === 'react-dom' || pkg === 'scheduler') return 'vendor-react'
            if (pkg === 'recharts' || pkg.startsWith('d3-') || pkg === 'victory-vendor' || pkg === 'recharts-scale' || pkg === 'react-smooth') return 'vendor-charts'
            if (pkg === 'framer-motion' || pkg === 'motion' || pkg === 'motion-dom' || pkg === 'motion-utils') return 'vendor-motion'
            return 'vendor'
          },
        },
      },
    },
  }
})
