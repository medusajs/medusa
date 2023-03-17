import { getConfigFile } from "medusa-core-utils"
import { ConfigModule, PluginOptions } from "../types"

export const loadConfig = () => {
  const { configModule } = getConfigFile<ConfigModule>(
    process.cwd(),
    "medusa-config"
  )

  const plugin = configModule.plugins.find(
    (p) =>
      (typeof p === "string" && p === "@medusajs/admin") ||
      (typeof p === "object" && p.resolve === "@medusajs/admin")
  )

  let defaultConfig: PluginOptions = {
    serve: true,
    path: "app",
  }

  if (typeof plugin !== "string") {
    const { options } = plugin as { options: PluginOptions }
    defaultConfig = {
      serve: options.serve ?? defaultConfig.serve,
      path: options.path ?? defaultConfig.path,
      backend: options.backend ?? defaultConfig.backend,
      outDir: options.outDir ?? defaultConfig.outDir,
    }
  }

  return defaultConfig
}
