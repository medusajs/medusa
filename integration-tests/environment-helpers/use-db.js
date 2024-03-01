const path = require("path")

const { getConfigFile } = require("medusa-core-utils")
const { asValue } = require("awilix")
const {
  isObject,
  createMedusaContainer,
  MedusaV2Flag,
} = require("@medusajs/utils")
const { dropDatabase } = require("pg-god")
const { DataSource } = require("typeorm")
const dbFactory = require("./use-template-db")
const { ContainerRegistrationKeys } = require("@medusajs/utils")
const { migrateMedusaApp } = require("@medusajs/medusa/dist/loaders/medusa-app")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

const keepTables = [
  "store",
  "staged_job",
  "shipping_profile",
  "fulfillment_provider",
  "payment_provider",
  "country",
  "region_country",
  "currency",
  "migrations",
  "mikro_orm_migrations",
]

const DbTestUtil = {
  db_: null,
  pgConnection_: null,

  setDb: function (dataSource) {
    this.db_ = dataSource
  },

  setPgConnection: function (pgConnection) {
    this.pgConnection_ = pgConnection
  },

  clear: async function () {
    this.db_.synchronize(true)
  },

  teardown: async function ({ forceDelete } = {}) {
    forceDelete = forceDelete || []
    const manager = this.db_.manager

    await manager.query(`SET session_replication_role = 'replica';`)
    const tableNames = await manager.query(`SELECT table_name
                                            FROM information_schema.tables
                                            WHERE table_schema = 'public';`)

    for (const { table_name } of tableNames) {
      if (
        keepTables.includes(table_name) &&
        !forceDelete.includes(table_name)
      ) {
        continue
      }

      await manager.query(`DELETE
                           FROM "${table_name}";`)
    }

    await manager.query(`SET session_replication_role = 'origin';`)
  },

  shutdown: async function () {
    await this.db_?.destroy()
    await this.pgConnection_?.context?.destroy()

    return await dropDatabase({ databaseName: DB_NAME }, pgGodCredentials)
  },
}

const instance = DbTestUtil

module.exports = {
  initDb: async function ({
    cwd,
    database_extra,
    env,
    force_modules_migration,
  }) {
    if (isObject(env)) {
      Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
    }

    const { configModule } = getConfigFile(cwd, `medusa-config`)

    const featureFlagsLoader =
      require("@medusajs/medusa/dist/loaders/feature-flags").default

    const featureFlagRouter = featureFlagsLoader(configModule)
    const modelsLoader = require("@medusajs/medusa/dist/loaders/models").default
    const entities = modelsLoader({}, { register: false })

    await dbFactory.createFromTemplate(DB_NAME)

    // get migrations with enabled featureflags
    const migrationDir = path.resolve(
      path.join(
        __dirname,
        `../../`,
        `node_modules`,
        `@medusajs`,
        `medusa`,
        `dist`,
        `migrations`,
        `*.js`
      )
    )

    const {
      getEnabledMigrations,
      getModuleSharedResources,
    } = require("@medusajs/medusa/dist/commands/utils/get-migrations")

    const { migrations: moduleMigrations, models: moduleModels } =
      getModuleSharedResources(configModule, featureFlagRouter)

    const enabledMigrations = getEnabledMigrations([migrationDir], (flag) =>
      featureFlagRouter.isFeatureEnabled(flag)
    )

    const enabledEntities = entities.filter(
      (e) => typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled()
    )

    const dbDataSource = new DataSource({
      type: "postgres",
      url: DB_URL,
      entities: enabledEntities.concat(moduleModels),
      migrations: enabledMigrations.concat(moduleMigrations),
      extra: database_extra ?? {},
      name: "integration-tests",
    })

    await dbDataSource.initialize()

    await dbDataSource.runMigrations()

    instance.setDb(dbDataSource)

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

      const pgConnection = await pgConnectionLoader({ configModule, container })

      container.register({
        [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
        [ContainerRegistrationKeys.LOGGER]: asValue(console),
        [ContainerRegistrationKeys.MANAGER]: asValue(dbDataSource.manager),
        [ContainerRegistrationKeys.PG_CONNECTION]: asValue(pgConnection),
        featureFlagRouter: asValue(featureFlagRouter),
      })

      instance.setPgConnection(pgConnection)

      await migrateMedusaApp(
        { configModule, container },
        { registerInContainer: false }
      )
    }

    return dbDataSource
  },
  useDb: function () {
    return instance
  },
}
