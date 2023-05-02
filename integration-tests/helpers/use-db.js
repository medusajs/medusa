const path = require("path")

const { getConfigFile } = require("medusa-core-utils")
const { dropDatabase } = require("pg-god")
const { DataSource } = require("typeorm")
const dbFactory = require("./use-template-db")

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
  "currency",
]

let dataSourceType = "postgresql"

const DbTestUtil = {
  db_: null,

  setDb: function (dataSource) {
    this.db_ = dataSource
  },

  clear: async function () {
    this.db_.synchronize(true)
  },

  teardown: async function ({ forceDelete } = {}) {
    forceDelete = forceDelete || []

    const entities = this.db_.entityMetadatas

    const manager = this.db_.manager

    if (dataSourceType === "sqlite") {
      await manager.query(`PRAGMA foreign_keys = OFF`)
    } else {
      await manager.query(`SET session_replication_role = 'replica';`)
    }

    for (const entity of entities) {
      if (
        keepTables.includes(entity.tableName) &&
        !forceDelete.includes(entity.tableName)
      ) {
        continue
      }

      await manager.query(`DELETE
                           FROM "${entity.tableName}";`)
    }
    if (dataSourceType === "sqlite") {
      await manager.query(`PRAGMA foreign_keys = ON`)
    } else {
      await manager.query(`SET session_replication_role = 'origin';`)
    }
  },

  shutdown: async function () {
    await this.db_.destroy()
    return await dropDatabase({ DB_NAME }, pgGodCredentials)
  },
}

const instance = DbTestUtil

module.exports = {
  initDb: async function ({ cwd, database_extra }) {
    const { configModule } = getConfigFile(cwd, `medusa-config`)
    const { projectConfig, featureFlags } = configModule

    const featureFlagsLoader =
      require("@medusajs/medusa/dist/loaders/feature-flags").default

    const featureFlagsRouter = featureFlagsLoader({ featureFlags })
    const modelsLoader = require("@medusajs/medusa/dist/loaders/models").default
    const entities = modelsLoader({}, { register: false })

    if (projectConfig.database_type === "sqlite") {
      dataSourceType = "sqlite"
      const dataSource = new DataSource({
        type: "sqlite",
        database: projectConfig.database_database,
        synchronize: true,
        entities,
        extra: database_extra ?? {},
      })

      const dbDataSource = await dataSource.initialize()

      instance.setDb(dbDataSource)
      return dbDataSource
    } else {
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
        getModuleSharedResources(configModule, featureFlagsRouter)

      const enabledMigrations = getEnabledMigrations([migrationDir], (flag) =>
        featureFlagsRouter.isFeatureEnabled(flag)
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
      return dbDataSource
    }
  },
  useDb: function () {
    return instance
  },
}
