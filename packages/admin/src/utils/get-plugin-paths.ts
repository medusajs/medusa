import { logger } from "@medusajs/admin-ui"
import type { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"
import path from "node:path"

export async function getPluginPaths() {
  const { configModule, error } = getConfigFile<ConfigModule>(
    path.resolve(process.cwd()),
    "medusa-config.js"
  )

  if (error) {
    logger.panic("Error loading `medusa-config.js`")
  }

  const plugins = configModule.plugins || []

  const paths = plugins.map((p) => {
    return typeof p === "string" ? p : p.resolve
  })

  return paths
}
