import { logger } from "@medusajs/admin-ui"
import type { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"
import path from "path"

function hasEnabledUI(options: Record<string, unknown>) {
  return "enableUI" in options && options.enableUI === true
}

export async function getPluginPaths() {
  const { configModule, error } = getConfigFile<ConfigModule>(
    path.resolve(process.cwd()),
    "medusa-config.js"
  )

  if (error) {
    logger.panic("Error loading `medusa-config.js`")
  }

  const plugins = configModule.plugins || []

  const paths: string[] = []

  for (const p of plugins) {
    if (typeof p === "string") {
      continue
    } else {
      const options = p.options || {}

      /**
       * While the feature is in beta, we only want to load plugins that have
       * enabled the UI explicitly. In the future, we will flip this check so
       * we only exclude plugins that have set `enableUI` to false.
       */
      if (hasEnabledUI(options)) {
        paths.push(p.resolve)
      }
    }
  }

  return paths
}
