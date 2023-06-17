import type { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"
import { PluginOptions } from "../types"

export const loadConfig = (): PluginOptions | null => {
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

  if (typeof plugin !== "string") {
    const { options } = plugin as { options: PluginOptions }

    const serve = options.serve !== undefined ? options.serve : config.serve

    const serverUrl = serve
      ? config.backend
      : options.backend
      ? options.backend
      : "/"

    config = {
      serve,
      autoRebuild: options.autoRebuild ?? config.autoRebuild,
      path: options.path ?? config.path,
      outDir: options.outDir ?? config.outDir,
      backend: serverUrl,
    }
  }

  return config
}
