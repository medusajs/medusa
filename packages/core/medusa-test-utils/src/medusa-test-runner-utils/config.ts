import { getConfigFile } from "@medusajs/utils"
import { ConfigModule } from "@medusajs/framework"

export async function configLoaderOverride(
  entryDirectory: string,
  override: { clientUrl: string; debug?: boolean }
) {
  const { configModule, error } = getConfigFile<ConfigModule>(
    entryDirectory,
    "medusa-config.js"
  )

  if (error) {
    throw new Error(error.message || "Error during config loading")
  }

  const { configManager } = await import("@medusajs/framework/config")

  configModule.projectConfig.databaseUrl = override.clientUrl
  configModule.projectConfig.databaseLogging = !!override.debug
  configModule.projectConfig.databaseDriverOptions =
    override.clientUrl.includes("localhost")
      ? {}
      : {
          connection: {
            ssl: { rejectUnauthorized: false },
          },
          idle_in_transaction_session_timeout: 20000,
        }

  configManager.loadConfig(configModule)
}
