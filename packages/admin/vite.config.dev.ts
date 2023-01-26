import react from "@vitejs/plugin-react"
import dns from "dns"
import { defineConfig } from "vite"

// Resolve localhost for Node v16 and older.
// @see https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder("verbatim")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "dashboard",
  define: {
    __BASENAME__: JSON.stringify("/"),
  },
  cacheDir: "dashboard/.cache",
})
