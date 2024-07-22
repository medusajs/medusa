import { getConfigFile } from "@medusajs/utils"

export async function configLoaderOverride(
  entryDirectory: string,
  override: { clientUrl: string; debug?: boolean }
) {
  const { configManager } = await import("@medusajs/framework/config")
  const { configModule, error } = getConfigFile<
    ReturnType<typeof configManager.loadConfig>
  >(entryDirectory, "medusa-config.js")

  if (error) {
    throw new Error(error.message || "Error during config loading")
  }

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
