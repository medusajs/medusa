/// <reference types="vite/client" />

import react from "@vitejs/plugin-react"
// Imported from `vitest/config`, not `vite`: Vitest 4 no longer augments Vite's
// `UserConfig` with a `test` property, so `/// <reference types="vitest" />` plus
// Vite's own `defineConfig` no longer typechecks.
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/blocks": "/src/blocks",
      "@/components": "/src/components",
      "@/providers": "/src/providers",
      "@/hooks": "/src/hooks",
      "@/utils": "/src/utils",
      "@/types": "/src/types",
    },
  },
  test: {
    setupFiles: "./setup-test.ts",
    coverage: {
      reporter: ["lcov", "text"],
      include: ["src/**"],
      exclude: ["**/*.stories.tsx", "**/index.ts"], // exclude stories and index files
    },
    globals: true,
    environment: "jsdom",
    css: false,
  },
})
