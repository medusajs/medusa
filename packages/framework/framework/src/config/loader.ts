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

// TODO: Later on we could store the config manager into the unique container
export const configManager = new ConfigManager()

container.register(
  ContainerRegistrationKeys.CONFIG_MODULE,
  asFunction(() => configManager)
)

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

  return configManager.loadConfig({
    projectConfig: configModule,
    baseDir: entryDirectory,
  })
}
