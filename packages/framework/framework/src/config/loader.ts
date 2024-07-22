import { ConfigModule } from "./types"
import { getConfigFile } from "@medusajs/utils"
import { logger } from "../logger"
import { ConfigManager } from "./config"

const handleConfigError = (error: Error): void => {
  logger.error(`Error in loading config: ${error.message}`)
  if (error.stack) {
    logger.error(error.stack)
  }
  process.exit(1)
}

/**
 * Loads the config file and returns the config module after validating, normalizing the configurations
 *
 * @param entryDirectory The directory to find the config file from
 * @param configFileName The name of the config file to search for in the entry directory
 */
export function configLoader(
  entryDirectory: string,
  configFileName: string
): ConfigModule {
  const { configModule, error } = getConfigFile<ConfigModule>(
    entryDirectory,
    configFileName
  )

  if (error) {
    handleConfigError(error)
  }

  const configManager = new ConfigManager(configModule, {
    isProduction: ["production", "prod"].includes(process.env.NODE_ENV || ""),
    envWorkMode: process.env
      .MEDUSA_WORKER_MODE as ConfigModule["projectConfig"]["workerMode"],
  })

  return configManager.getConfig()
}
