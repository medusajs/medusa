const { asValue } = require("awilix")
const {
  isObject,
  createMedusaContainer,
  getConfigFile,
} = require("@medusajs/utils")
const { ContainerRegistrationKeys } = require("@medusajs/utils")
const { migrateMedusaApp } = require("@medusajs/medusa/dist/loaders/medusa-app")

module.exports = {
  initDb: async function ({ cwd, env }) {
    if (isObject(env)) {
      Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
    }

    const { configModule } = getConfigFile(cwd, `medusa-config`)

    await dbFactory.createFromTemplate(DB_NAME)

    const pgConnectionLoader =
      require("@medusajs/medusa/dist/loaders/pg-connection").default

    const featureFlagLoader =
      require("@medusajs/medusa/dist/loaders/feature-flags").default

    const container = createMedusaContainer()

    const featureFlagRouter = await featureFlagLoader(configModule)

    const pgConnection = await pgConnectionLoader({ configModule, container })

    container.register({
      [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
      [ContainerRegistrationKeys.LOGGER]: asValue(console),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(pgConnection),
      featureFlagRouter: asValue(featureFlagRouter),
    })

    await migrateMedusaApp(
      { configModule, container },
      { registerInContainer: false }
    )

    return pgConnection
  },
}
