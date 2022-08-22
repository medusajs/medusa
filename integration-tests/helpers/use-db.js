const path = require("path")

const { dropDatabase } = require("pg-god")
const { createConnection } = require("typeorm")
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

let connectionType = "postgresql"

const DbTestUtil = {
  db_: null,

  setDb: function (connection) {
    this.db_ = connection
  },

  clear: async function () {
    this.db_.synchronize(true)
  },

  teardown: async function ({ forceDelete } = {}) {
    forceDelete = forceDelete || []

    const entities = this.db_.entityMetadatas
    const manager = this.db_.manager

    if (connectionType === "sqlite") {
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

      await manager.query(`DELETE FROM "${entity.tableName}";`)
    }
    if (connectionType === "sqlite") {
      await manager.query(`PRAGMA foreign_keys = ON`)
    } else {
      await manager.query(`SET session_replication_role = 'origin';`)
    }
  },

  shutdown: async function () {
    await this.db_.close()
    return await dropDatabase({ DB_NAME }, pgGodCredentials)
  },
}

const instance = DbTestUtil

module.exports = {
  initDb: async function ({ cwd }) {
    const configPath = path.resolve(path.join(cwd, `medusa-config.js`))
    const { projectConfig, featureFlags } = require(configPath)

    const featureFlagsLoader = require(path.join(
      cwd,
      `node_modules`,
      `@medusajs`,
      `medusa`,
      `dist`,
      `loaders`,
      `feature-flags`
    )).default

    const featureFlagsRouter = featureFlagsLoader({ featureFlags })

    const modelsLoader = require(path.join(
      cwd,
      `node_modules`,
      `@medusajs`,
      `medusa`,
      `dist`,
      `loaders`,
      `models`
    )).default

    const entities = modelsLoader({}, { register: false })

    if (projectConfig.database_type === "sqlite") {
      connectionType = "sqlite"
      const dbConnection = await createConnection({
        type: "sqlite",
        database: projectConfig.database_database,
        synchronize: true,
        entities,
      })

      instance.setDb(dbConnection)
      return dbConnection
    } else {
      await dbFactory.createFromTemplate(DB_NAME)

      // get migraitons with enabled featureflags
      const migrationDir = path.resolve(
        path.join(
          cwd,
          `node_modules`,
          `@medusajs`,
          `medusa`,
          `dist`,
          `migrations`,
          `*.js`
        )
      )

      const { getEnabledMigrations } = require(path.join(
        cwd,
        `node_modules`,
        `@medusajs`,
        `medusa`,
        `dist`,
        `commands`,
        `utils`,
        `get-migrations`
      ))

      const enabledMigrations = await getEnabledMigrations(
        [migrationDir],
        (flag) => featureFlagsRouter.isFeatureEnabled(flag)
      )

      const enabledEntities = entities.filter(
        (e) => typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled()
      )

      const dbConnection = await createConnection({
        type: "postgres",
        url: DB_URL,
        entities: enabledEntities,
        migrations: enabledMigrations,
      })

      await dbConnection.runMigrations()

      instance.setDb(dbConnection)
      return dbConnection
    }
  },
  useDb: function () {
    return instance
  },
}
