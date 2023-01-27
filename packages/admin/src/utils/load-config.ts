import { getConfigFile } from "medusa-core-utils"
import { ConfigModule, PluginOptions } from "../types"
import { reporter } from "./reporter"

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

  if (!plugin) {
    reporter.error(
      'Could not find "@medusajs/admin" in `medusa-config.js` file. Make sure to add it to the plugins array.'
    )
    process.exit(1)
  }

  let defaultConfig: PluginOptions = {
    serve: true,
    path: "/app",
    dev: {
      autoOpen: true,
    },
  }

  if (typeof plugin !== "string") {
    const { options } = plugin as { options: PluginOptions }
    defaultConfig.path = options.path || defaultConfig.path
    defaultConfig.serve = options.serve || defaultConfig.serve
    defaultConfig.dev = options.dev || defaultConfig.dev
    defaultConfig.build = options.build || defaultConfig.build
  }

  return defaultConfig
}
