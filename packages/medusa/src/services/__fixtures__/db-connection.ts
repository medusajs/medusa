import { join, resolve } from "path"
import { Connection, createConnection, getConnection } from "typeorm"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""
const DB_NAME = process.env.DB_TEMP_NAME ?? `medusa-integration-1`
const DB_FULL_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}`

export const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

class DatabaseFactory {
  protected masterConnectionName = "master"
  protected DB_NAME_ = DB_NAME

  constructor() {}

  get DB_NAME(): string {
    return this.DB_NAME_
  }

  async getMasterConnection() {
    try {
      return await getConnection(this.masterConnectionName)
    } catch (err) {
      return await this.createMasterConnection()
    }
  }

  async createMasterConnection() {
    return await createConnection({
      type: "postgres",
      name: this.masterConnectionName,
      url: `${DB_URL}`,
    })
  }

  async createFromTemplate(dbName) {
    const connection = await this.getMasterConnection()

    await connection.query(`DROP DATABASE IF EXISTS "${dbName}";`)
    await connection.query(`CREATE DATABASE "${dbName}";`)
  }

  async initDb(): Promise<Connection> {
    const modelsLoader = require("../../loaders/models").default

    const entities = modelsLoader({}, { register: false, isTest: true })

    await this.createFromTemplate(DB_NAME)

    const migrationDir = resolve(
      join(__dirname, `..`, `..`, `migrations`, `*.ts`)
    )

    const { getEnabledMigrations } = require(join(
      __dirname,
      `..`,
      `..`,
      `commands`,
      `utils`,
      `get-migrations`
    ))

    const enabledMigrations = await getEnabledMigrations(
      [migrationDir],
      () => false
    )

    const enabledEntities = entities.filter(
      (e) => typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled()
    )

    return await createConnection({
      type: "postgres",
      url: DB_FULL_URL,
      migrationsRun: true,
      entities: enabledEntities,
      migrations: enabledMigrations,
    })
  }
}

export const databaseFactory = new DatabaseFactory()
