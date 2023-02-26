/// <reference types="vitest" />
import react from "@vitejs/plugin-react"
import dns from "dns"
import { defineConfig } from "vite"

// Resolve localhost for Node v16 and older.
// @see https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder("verbatim")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["/test/setup.ts"],
  },
  root: "ui",
  define: {
    __BASE__: JSON.stringify("/"),
    __MEDUSA_BACKEND_URL__: JSON.stringify("http://localhost:9000"),
  },
  build: {
    outDir: "preview",
  },
})
