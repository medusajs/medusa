import type { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"
import { PluginOptions } from "../types"

export const loadConfig = (isDev?: boolean): PluginOptions | null => {
  const { configModule } = getConfigFile<ConfigModule>(
    process.cwd(),
    "medusa-config"
  )

  const plugin = configModule.plugins.find(
    (p) =>
      (typeof p === "string" && p === "@medusajs/admin") ||
      (typeof p === "object" && p.resolve === "@medusajs/admin")
  )

  if (!plugin) {
    return null
  }

  let config: PluginOptions = {
    serve: true,
    autoRebuild: false,
    path: "/app",
    outDir: "build",
    backend: "/",
  }

  if (isDev) {
    config = {
      ...config,
      serve: false,
      path: "/",
      backend: "http://localhost:9000",
      develop: {
        open: true,
        port: 7001,
        host: "localhost",
        allowedHosts: "auto",
      },
    }
  }

  if (typeof plugin !== "string") {
    const options = (plugin as { options: PluginOptions }).options ?? {}

    config = {
      serve: isDev ? false : options.serve ?? config.serve,
      autoRebuild: options.autoRebuild ?? config.autoRebuild,
      path: options.path ?? config.path,
      outDir: options.outDir ?? config.outDir,
      backend: options.backend ?? config.backend,
      develop: {
        open: options.develop?.open ?? config.develop.open,
        port: options.develop?.port ?? config.develop.port,
        host: options.develop?.host ?? config.develop.host,
        allowedHosts:
          options.develop?.allowedHosts ?? config.develop.allowedHosts,
        webSocketURL:
          options.develop?.webSocketURL ?? config.develop.webSocketURL,
      },
    }
  }

  return config
}
