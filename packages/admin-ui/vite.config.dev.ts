import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "ui",
  define: {
    __BASE__: JSON.stringify("/"),
    __BACKEND__: JSON.stringify("http://localhost:9000"),
  },
  build: {
    outDir: "preview",
  },
})
