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
    serve: false,
    autoRebuild: false,
  }

  if (typeof plugin !== "string") {
    const { options } = plugin as { options: PluginOptions }
    defaultConfig = {
      serve: options.serve ?? defaultConfig.serve,
      autoRebuild: options.autoRebuild ?? defaultConfig.autoRebuild,
      path: options.path ?? defaultConfig.path,
      backend: options.backend ?? defaultConfig.backend,
      buildDir: options.buildDir ?? defaultConfig.buildDir,
      include: options.include ?? defaultConfig.include,
      includeDist: options.includeDist ?? defaultConfig.includeDist,
    }
  }

  return defaultConfig
}
