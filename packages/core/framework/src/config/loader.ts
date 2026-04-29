import { ContainerRegistrationKeys, getConfigFile } from "@medusajs/utils"
import { asFunction } from "../deps/awilix"
import { container } from "../container"
import { logger as defaultLogger } from "../logger"
import { ConfigManager } from "./config"
import { ConfigModule } from "./types"

const handleConfigError = (error: Error): void => {
  defaultLogger.error(`Error in loading config: ${error.message}`)
  if (error.stack) {
    defaultLogger.error(error.stack)
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
 * @param options.throwOnError When false, missing config files and validation errors won't throw.
 * Useful for build/compile commands. Defaults to true.
 */
export async function configLoader(
  entryDirectory: string,
  configFileName: string = "medusa-config",
  options?: {
    throwOnError?: boolean
  }
): Promise<ConfigModule> {
  const { throwOnError = true } = options ?? {}
  const config = await getConfigFile<ConfigModule>(
    entryDirectory,
    configFileName
  )

  if (config.error && throwOnError) {
    handleConfigError(config.error)
  }

  return configManager.loadConfig({
    projectConfig: config.configModule!,
    baseDir: entryDirectory,
    throwOnError,
  })
}
