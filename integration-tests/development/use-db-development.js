const path = require("path")

const { DataSource } = require("typeorm")
const { getConfigFile } = require("medusa-core-utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

process.env.NODE_ENV = "development"

require("./dev-require")

async function createDB() {
  const connection = new DataSource({
    type: "postgres",
    url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}`,
  })

  await connection.initialize()

  await connection.query(`DROP DATABASE IF EXISTS "${DB_NAME}";`)
  await connection.query(`CREATE DATABASE "${DB_NAME}";`)
  await connection.destroy()
}

module.exports = {
  initDb: async function () {
    const cwd = path.resolve(path.join(__dirname, "../.."))

    const { configModule } = getConfigFile(
      path.join(__dirname),
      `medusa-config`
    )

    const { featureFlags } = configModule

    const basePath = path.join(cwd, "packages/medusa/src")

    const featureFlagsLoader =
      require("@medusajs/medusa/dist/loaders/feature-flags").default

    const featureFlagsRouter = featureFlagsLoader({ featureFlags })

    const modelsLoader = require("@medusajs/medusa/dist/loaders/models").default

    const {
      getEnabledMigrations,
      getModuleSharedResources,
      runIsolatedModulesMigration,
    } = require("@medusajs/medusa/dist/commands/utils/get-migrations")

    const entities = modelsLoader({}, { register: false })

    // get migraitons with enabled featureflags
    const migrationDir = path.resolve(
      path.join(basePath, `migrations`, `*.{j,t}s`)
    )

    const isFlagEnabled = (flag) => featureFlagsRouter.isFeatureEnabled(flag)

    const { migrations: moduleMigrations, models: moduleModels } =
      getModuleSharedResources(configModule, featureFlagsRouter)

    const enabledMigrations = getEnabledMigrations(
      [migrationDir],
      isFlagEnabled
    )

    const enabledEntities = entities.filter(
      (e) => typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled()
    )

    await createDB()

    const dbConnection = new DataSource({
      type: "postgres",
      url: DB_URL,
      entities: enabledEntities.concat(moduleModels),
      migrations: enabledMigrations.concat(moduleMigrations),
      // logging: true,
    })

    await dbConnection.initialize()

    await dbConnection.runMigrations()

    await runIsolatedModulesMigration(configModule)

    return dbConnection
  },
}
