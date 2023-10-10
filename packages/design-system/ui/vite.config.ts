/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
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
      all: true,
      reporter: ["lcov", "text"],
      include: ["src/**"],
      exclude: ["**/*.stories.tsx", "**/index.ts"], // exclude stories and index files
    },
    globals: true,
    environment: "jsdom",
    css: false,
  },
})
