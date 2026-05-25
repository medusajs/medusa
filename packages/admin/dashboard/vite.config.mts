import inject from "@medusajs/admin-vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import inspect from "vite-plugin-inspect"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const BASE = env.VITE_MEDUSA_BASE || "/"
  const BACKEND_URL = env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const PROXY_BACKEND_URL =
    env.VITE_MEDUSA_PROXY_BACKEND_URL || "http://localhost:9000"
  const STOREFRONT_URL =
    env.VITE_MEDUSA_STOREFRONT_URL || "http://localhost:8000"
  const AUTH_TYPE = env.VITE_MEDUSA_AUTH_TYPE || undefined
  const JWT_TOKEN_STORAGE_KEY =
    env.VITE_MEDUSA_JWT_TOKEN_STORAGE_KEY || undefined

  /**
   * Add this to your .env file to specify the project to load admin extensions from.
   */
  const MEDUSA_PROJECT = env.VITE_MEDUSA_PROJECT || null
  const sources = MEDUSA_PROJECT ? [MEDUSA_PROJECT] : []

  return {
    plugins: [
      inspect(),
      react(),
      inject({
        sources,
      }),
    ],
    define: {
      __BASE__: JSON.stringify(BASE),
      __BACKEND_URL__: JSON.stringify(BACKEND_URL),
      __STOREFRONT_URL__: JSON.stringify(STOREFRONT_URL),
      __AUTH_TYPE__: JSON.stringify(AUTH_TYPE),
      __JWT_TOKEN_STORAGE_KEY__: JSON.stringify(JWT_TOKEN_STORAGE_KEY),
    },
    server: {
      open: true,
      proxy: {
        "/admin": {
          target: PROXY_BACKEND_URL,
          changeOrigin: true,
        },
        "/auth": {
          target: PROXY_BACKEND_URL,
          changeOrigin: true,
        },
        "/cloud": {
          target: PROXY_BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
