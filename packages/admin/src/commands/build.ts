import { getConfigFile } from "medusa-core-utils"
import AdminService from "../services/admin"
import { ConfigModule, PluginOptions } from "../types"

export default function build() {
  const admin = new AdminService()

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
    console.error("Could not find @medusajs/admin in `medusa-config.js` file")
    process.exit(1)
  }

  const buildConfig = {
    base: "/app",
  }

  if (typeof plugin !== "string") {
    const { options } = plugin as { options: PluginOptions }
    buildConfig.base = options.base || buildConfig.base
  }

  admin.build(buildConfig)
}
