import { ConfigModule } from "@medusajs/types"
import { getConfigFile } from "medusa-core-utils"

export function isAdminInstalled(root: string) {
  const { configModule, error } = getConfigFile<ConfigModule>(
    root,
    "medusa-config.js"
  )

  if (error) {
    return false
  }

  const adminPlugin = configModule.plugins?.find((p) => {
    return typeof p === "string"
      ? p === "@medusajs/admin"
      : p.resolve === "@medusajs/admin"
  })

  if (!adminPlugin) {
    return false
  }

  return true
}
