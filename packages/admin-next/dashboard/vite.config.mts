import inject from "@medusajs/admin-vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const BASE = "/"
const BACKEND_URL = "http://localhost:9000"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inject()],
  define: {
    __BASE__: JSON.stringify(BASE),
    __BACKEND_URL__: JSON.stringify(BACKEND_URL),
  },
  server: {
    open: true,
  },
})
