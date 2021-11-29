const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const { createDatabase, dropDatabase } = require("pg-god")
const { createConnection, getConnection } = require("typeorm")

const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost`

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
}

class TemplateDb {
  constructor() {
    this.connection_ = null
  }

  async createMasterConnection() {
    const connection = await createConnection({
      type: "postgres",
      name: "master",
      url: `${DB_URL}`,
    })

    return connection
  }

  async createDb_() {
    try {
      const connection = await this.getMasterConnection()

      const migrationDir = path.resolve(
        path.join(
          process.cwd(),
          "integration-tests",
          "api",
          `node_modules`,
          `@medusajs`,
          `medusa`,
          `dist`,
          `migrations`
        )
      )

      const templateDbName = "medusa-integration-template"

      await dropDatabase(
        {
          databaseName: templateDbName,
          errorIfNonExist: false,
        },
        pgGodCredentials
      )
      await createDatabase({ databaseName: templateDbName }, pgGodCredentials)

      const templateDbConnection = await createConnection({
        type: "postgres",
        name: "templateConnection",
        url: `${DB_URL}/${templateDbName}`,
        migrations: [`${migrationDir}/*.js`],
      })

      const res = await templateDbConnection.runMigrations()
      await templateDbConnection.close()

      return connection
    } catch (err) {
      console.log("createdb heeeeeeeeeeeeeeere")
      console.log(err)
    }
  }

  async getMasterConnection() {
    try {
      return await getConnection("master")
    } catch (err) {
      return await this.createMasterConnection()
    }
  }

  async createFromTemplate(dbName) {
    const connection = await this.getMasterConnection()

    await connection.query(`DROP DATABASE IF EXISTS "${dbName}";`)
    await connection.query(
      `CREATE DATABASE "${dbName}" TEMPLATE "medusa-integration-template";`
    )
  }

  async destroy() {
    let connection = await this.getMasterConnection()

    await connection.query(
      `DROP DATABASE IF EXISTS "medusa-integration-template";`
    )
    await connection.close()
  }
}

module.exports = new TemplateDb()
