import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const base = env.ADMIN_UI_BASE_PATH ? `/${env.ADMIN_UI_BASE_PATH}/` : "/app/"

  return {
    plugins: [react()],
    base,
  }
})
