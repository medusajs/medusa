const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const { dropDatabase } = require("pg-god")
const { createConnection } = require("typeorm")
const dbFactory = require("./use-template-db")

const workerId = parseInt(process.env.JEST_WORKER_ID || "1")
const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost/medusa-integration-${workerId}`

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
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
    const databaseName = `medusa-integration-${workerId}`
    return await dropDatabase({ databaseName }, pgGodCredentials)
  },
}

const instance = DbTestUtil

module.exports = {
  initDb: async function ({ cwd }) {
    const configPath = path.resolve(path.join(cwd, `medusa-config.js`))

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

    const { projectConfig } = require(configPath)
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
      const databaseName = `medusa-integration-${workerId}`

      await dbFactory.createFromTemplate(databaseName)

      const dbConnection = await createConnection({
        type: "postgres",
        url: DB_URL,
        entities,
      })

      instance.setDb(dbConnection)
      return dbConnection
    }
  },
  useDb: function () {
    return instance
  },
}
