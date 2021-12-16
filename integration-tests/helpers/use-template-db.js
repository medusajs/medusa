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

class DatabaseFactory {
  constructor() {
    this.connection_ = null
    this.masterConnectionName = "name"
    this.templateDbName = "medusa-integration-template"
  }

  async createTemplateDb_() {
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

      await dropDatabase(
        {
          databaseName: this.templateDbName,
          errorIfNonExist: false,
        },
        pgGodCredentials
      )
      await createDatabase(
        { databaseName: this.templateDbName },
        pgGodCredentials
      )

      const templateDbConnection = await createConnection({
        type: "postgres",
        name: "templateConnection",
        url: `${DB_URL}/${this.templateDbName}`,
        migrations: [`${migrationDir}/*.js`],
      })

      await templateDbConnection.runMigrations()
      await templateDbConnection.close()

      return connection
    } catch (err) {
      console.log("error in createTemplateDb_")
      console.log(err)
    }
  }

  async getMasterConnection() {
    try {
      return await getConnection(this.masterConnectionName)
    } catch (err) {
      return await this.createMasterConnection()
    }
  }

  async createMasterConnection() {
    const connection = await createConnection({
      type: "postgres",
      name: this.masterConnectionName,
      url: `${DB_URL}`,
    })

    return connection
  }

  async createFromTemplate(dbName) {
    const connection = await this.getMasterConnection()

    await connection.query(`DROP DATABASE IF EXISTS "${dbName}";`)
    await connection.query(
      `CREATE DATABASE "${dbName}" TEMPLATE "${this.templateDbName}";`
    )
  }

  async destroy() {
    let connection = await this.getMasterConnection()

    await connection.query(`DROP DATABASE IF EXISTS "${this.templateDbName}";`)
    await connection.close()
  }
}

module.exports = new DatabaseFactory()
