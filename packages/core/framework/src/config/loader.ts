import { ConfigModule } from "./types"
import { ContainerRegistrationKeys, getConfigFile } from "@medusajs/utils"
import { logger } from "../logger"
import { ConfigManager } from "./config"
import { container } from "../container"
import { asFunction } from "awilix"

const handleConfigError = (error: Error): void => {
  logger.error(`Error in loading config: ${error.message}`)
  if (error.stack) {
    logger.error(error.stack)
  }
  process.exit(1)
}

export const configManager = new ConfigManager()

container.register(
  ContainerRegistrationKeys.CONFIG_MODULE,
  asFunction(() => configManager.config)
)

/**
 * Loads the config file and returns the config module after validating, normalizing the configurations
 *
 * @param entryDirectory The directory to find the config file from
 * @param configFileName The name of the config file to search for in the entry directory
 */
export async function configLoader(
  entryDirectory: string,
  configFileName: string
): Promise<ConfigModule> {
  const config = await getConfigFile<ConfigModule>(
    entryDirectory,
    configFileName
  )

  if (config.error) {
    handleConfigError(config.error)
  }

  return configManager.loadConfig({
    projectConfig: config.configModule!,
    baseDir: entryDirectory,
  })
}
