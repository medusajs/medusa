const path = require("path")

require("dotenv").config({ path: path.join(__dirname, "../.env.test") })

const { getConfigFile } = require("@medusajs/utils")
const { createDatabase, dropDatabase } = require("pg-god")
const { DataSource } = require("typeorm")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}`

let masterDataSource

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

class DatabaseFactory {
  constructor() {
    this.masterDataSourceName = "master"
    this.templateDbName = "medusa-integration-template"
  }

  async createTemplateDb_({ cwd }) {
    const { configModule } = getConfigFile(cwd, `medusa-config`)

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

    // filter migrations to only include those that don't have feature flags
    const enabledMigrations = getEnabledMigrations(
      [migrationDir],
      (flag) => false
    )

    const { migrations: moduleMigrations } =
      getModuleSharedResources(configModule)

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

    const templateDbDataSource = new DataSource({
      type: "postgres",
      name: "templateDataSource",
      url: `${DB_URL}/${this.templateDbName}`,
      migrations: enabledMigrations.concat(moduleMigrations),
    })

    await templateDbDataSource.initialize()

    await templateDbDataSource.runMigrations()

    await templateDbDataSource.destroy()
  }

  async getMasterDataSource() {
    masterDataSource = masterDataSource || (await this.createMasterDataSource())
    return masterDataSource
  }

  async createMasterDataSource() {
    const dataSource = new DataSource({
      type: "postgres",
      name: this.masterDataSourceName,
      url: `${DB_URL}`,
    })
    await dataSource.initialize()

    return dataSource
  }

  async createFromTemplate(dbName) {
    const dataSource = await this.getMasterDataSource()

    await dropDatabase({ databaseName: dbName }, pgGodCredentials)
    await dataSource.query(
      `CREATE DATABASE "${dbName}" TEMPLATE "${this.templateDbName}";`
    )
  }

  async destroy() {
    const dataSource = await this.getMasterDataSource()

    await dataSource.query(`DROP DATABASE IF EXISTS "${this.templateDbName}";`)
    await dataSource.destroy()
  }
}

module.exports = new DatabaseFactory()
