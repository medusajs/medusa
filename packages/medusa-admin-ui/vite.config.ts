import react from "@vitejs/plugin-react"
import dns from "dns"
import { env } from "process"
import { defineConfig } from "vite"

dns.setDefaultResultOrder("verbatim")

export default defineConfig(({ command }) => {
  const backend =
    command === "build"
      ? "/app/"
      : env.MEDUSA_BACKEND_URL || "http://localhost:9000"

  const base = command === "build" ? "/app/" : undefined

  return {
    plugins: [react()],
    base,
    define: {
      __MEDUSA_BACKEND_URL__: JSON.stringify(backend),
    },
    build: {
      outDir: "build",
    },
  }
})
