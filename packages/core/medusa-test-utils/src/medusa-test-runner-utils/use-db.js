const path = require("path")

const { asValue } = require("awilix")
const {
  isObject,
  createMedusaContainer,
  MedusaV2Flag,
} = require("@medusajs/utils")
const { DataSource } = require("typeorm")
const { ContainerRegistrationKeys } = require("@medusajs/utils")
const { logger } = require("@medusajs/medusa-cli/dist/reporter")

module.exports = {
  initDb: async function ({
    cwd,
    // use for v1 datasource only
    database_extra,
    env,
    force_modules_migration,
    dbUrl = "",
    dbSchema = "public",
  }) {
    if (isObject(env)) {
      Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
    }

    const configModuleLoader =
      require("@medusajs/medusa/dist/loaders/config").default
    const configModule = configModuleLoader(cwd)

    const featureFlagsLoader =
      require("@medusajs/medusa/dist/loaders/feature-flags").default

    const featureFlagRouter = featureFlagsLoader(configModule)

    const {
      getModuleSharedResources,
    } = require("@medusajs/medusa/dist/commands/utils/get-migrations")

    const { migrations: moduleMigrations, models: moduleModels } =
      getModuleSharedResources(configModule, featureFlagRouter)

    const dbDataSource = new DataSource({
      type: "postgres",
      url: dbUrl || configModule.projectConfig.database_url,
      entities: moduleModels,
      migrations: moduleMigrations,
      extra: database_extra ?? {},
      //name: "integration-tests",
      schema: dbSchema,
    })

    await dbDataSource.initialize()

    await dbDataSource.runMigrations()

    if (
      force_modules_migration ||
      featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)
    ) {
      const pgConnectionLoader =
        require("@medusajs/medusa/dist/loaders/pg-connection").default

      const featureFlagLoader =
        require("@medusajs/medusa/dist/loaders/feature-flags").default

      const container = createMedusaContainer()

      const featureFlagRouter = await featureFlagLoader(configModule)

      const pgConnection = await pgConnectionLoader({
        configModule: {
          ...configModule,
          projectConfig: {
            ...configModule.projectConfig,
            database_url: dbUrl || configModule.projectConfig.database_url,
          },
        },
        container,
      })

      container.register({
        [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
        [ContainerRegistrationKeys.LOGGER]: asValue(logger),
        [ContainerRegistrationKeys.MANAGER]: asValue(dbDataSource.manager),
        [ContainerRegistrationKeys.PG_CONNECTION]: asValue(pgConnection),
        featureFlagRouter: asValue(featureFlagRouter),
      })

      const {
        migrateMedusaApp,
      } = require("@medusajs/medusa/dist/loaders/medusa-app")
      await migrateMedusaApp(
        { configModule, container },
        { registerInContainer: false }
      )
    }

    return { dbDataSource, pgConnection }
  },
}
