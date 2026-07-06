import { VIRTUAL_MODULES } from "@medusajs/admin-shared"
import path from "path"
import type { HmrOptions, InlineConfig } from "vite"
import { injectTailwindCSS } from "../plugins/inject-tailwindcss"
import { writeStaticFiles } from "../plugins/write-static-files"
import { BundlerOptions } from "../types"

export async function getViteConfig(
  options: BundlerOptions
): Promise<InlineConfig> {
  const { searchForWorkspaceRoot, mergeConfig } = await import("vite")
  const { default: react } = await import("@vitejs/plugin-react")
  const { default: medusa } = await import("@medusajs/admin-vite-plugin")

  const getPort = await import("get-port")
  const hmrPort = process.env.HMR_PORT
    ? parseInt(process.env.HMR_PORT)
    : await getPort.default()
  const hmrOptions = getHmrConfig(hmrPort)
  const allowedHosts = getAllowedHosts()

  const root = path.resolve(process.cwd(), ".medusa/client")

  const backendUrl = options.backendUrl ?? ""
  const storefrontUrl = options.storefrontUrl ?? ""
  const authType = process.env.ADMIN_AUTH_TYPE ?? undefined
  const jwtTokenStorageKey =
    process.env.ADMIN_JWT_TOKEN_STORAGE_KEY ?? undefined

  const baseConfig: InlineConfig = {
    root,
    base: options.path,
    build: {
      emptyOutDir: true,
      outDir: path.resolve(process.cwd(), options.outDir),
    },
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react-dom/client",
        "react-router-dom",
        "react-i18next",
        "@medusajs/ui",
        "@medusajs/dashboard",
        "@medusajs/js-sdk",
        "@tanstack/react-query",
      ],
      exclude: [...VIRTUAL_MODULES],
    },
    define: {
      __BASE__: JSON.stringify(options.path),
      __BACKEND_URL__: JSON.stringify(backendUrl),
      __AUTH_TYPE__: JSON.stringify(authType),
      __JWT_TOKEN_STORAGE_KEY__: JSON.stringify(jwtTokenStorageKey),
      __STOREFRONT_URL__: JSON.stringify(storefrontUrl),
      __MAX_UPLOAD_FILE_SIZE__: options.maxUploadFileSize === Infinity ? "Infinity" : JSON.stringify(options.maxUploadFileSize ?? 1024 * 1024),
    },
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
      hmr: hmrOptions,
      ...(allowedHosts && { allowedHosts }),
    },
    plugins: [
      writeStaticFiles({
        plugins: options.plugins,
      }),
      injectTailwindCSS({
        entry: root,
        sources: options.sources,
        plugins: options.plugins,
      }),
      react(),
      medusa({
        sources: options.sources,
      }),
    ],
  }

  // Inject plugin environment variables with vite define
  const pluginEnv: Record<string, string | undefined> = {
    BACKEND_URL: backendUrl,
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("PLUGIN_")) {
      pluginEnv[key.replace(/^PLUGIN_/, "")] = value
    }
  }
  baseConfig.define!["process.env"] = JSON.stringify(pluginEnv)

  let finalConfig = baseConfig
  if (options.vite) {
    const customConfig = options.vite(baseConfig)
    finalConfig = mergeConfig(baseConfig, customConfig)
  }

  // Handle HMR_BIND_HOST after merge to detect conflicts
  if (process.env.HMR_BIND_HOST) {
    if (
      finalConfig.server?.hmr &&
      typeof finalConfig.server.hmr === "object" &&
      finalConfig.server.hmr.server
    ) {
      console.warn(
        "HMR_BIND_HOST is set but a custom hmr.server is already configured. HMR_BIND_HOST will be ignored."
      )
    } else {
      const { createServer } = require("http")
      const hmrServer = createServer()
      hmrServer.listen(hmrPort, process.env.HMR_BIND_HOST)
      if (!finalConfig.server) {
        finalConfig.server = {}
      }
      if (
        !finalConfig.server.hmr ||
        typeof finalConfig.server.hmr !== "object"
      ) {
        finalConfig.server.hmr = {}
      }
      finalConfig.server.hmr.server = hmrServer
    }
  }

  return finalConfig
}

function getAllowedHosts(): string[] | undefined {
  const hosts = process.env.__MEDUSA_ADMIN_ADDITIONAL_ALLOWED_HOSTS
  if (!hosts) {
    return undefined
  }
  return hosts.split(",").map((host) => host.trim())
}

function getHmrConfig(hmrPort: number): HmrOptions | boolean {
  const options: HmrOptions = {
    port: hmrPort,
  }

  if (process.env.HMR_PROTOCOL) {
    options.protocol = process.env.HMR_PROTOCOL
  }
  if (process.env.HMR_HOST) {
    options.host = process.env.HMR_HOST
  }
  if (process.env.HMR_CLIENT_PORT) {
    options.clientPort = parseInt(process.env.HMR_CLIENT_PORT)
  }

  return options
}
