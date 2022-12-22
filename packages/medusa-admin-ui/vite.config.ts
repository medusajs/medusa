import react from "@vitejs/plugin-react"
import dns from "dns"
import { env } from "process"
import { defineConfig } from "vite"

dns.setDefaultResultOrder("verbatim")

export default defineConfig(({ command }) => {
  const backend =
    command === "build"
      ? "/"
      : env.MEDUSA_BACKEND_URL || "http://localhost:9000"

  const base = command === "build" ? "/app/" : undefined

  return {
    plugins: [react()],
    base: "/app/",
    define: {
      __MEDUSA_BACKEND_URL__: JSON.stringify("http://localhost:9000"),
    },
    build: {
      outDir: "build",
    },
    optimizeDeps: {
      include: ["medusa-react"],
      exclude: ["typeorm", "medusa-interfaces"],
    },
  }
})
