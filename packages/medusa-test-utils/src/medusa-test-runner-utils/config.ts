import {
  FeatureFlag,
  getConfigFile,
  discoverAndRegisterFeatureFlags,
} from "@zjedene-medusa/framework/utils"

export async function configLoaderOverride(
  entryDirectory: string,
  override: { clientUrl: string; debug?: boolean }
) {
  const { configManager } = await import("@zjedene-medusa/framework/config")
  const { logger } = await import("@zjedene-medusa/framework")

  await discoverAndRegisterFeatureFlags({
    flagDir: entryDirectory,
    projectConfigFlags: {},
    router: FeatureFlag,
    logger,
  })

  const { configModule, error } = await getConfigFile<
    ReturnType<typeof configManager.loadConfig>
  >(entryDirectory, "medusa-config")

  if (error) {
    throw new Error(error.message || "Error during config loading")
  }

  configModule.projectConfig.databaseDriverOptions
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

  logger.info("Disabling admin as we run integration tests")
  Object.assign(configModule.admin ?? {}, { disable: true })

  configManager.loadConfig({
    projectConfig: configModule,
    baseDir: entryDirectory,
  })
}
