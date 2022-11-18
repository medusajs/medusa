import { join, resolve } from "path"
import { Connection, createConnection } from "typeorm"
import { createDatabase, dropDatabase } from "pg-god"

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
  protected connection: Connection
  protected masterConnectionName = "master"

  protected DB_NAME_ = DB_NAME

  constructor() {}

  get DB_NAME(): string {
    return this.DB_NAME_
  }

  async createDb() {
    await createDatabase({ databaseName: DB_NAME }, pgGodCredentials)
  }

  async dropDb() {
    await dropDatabase({ databaseName: DB_NAME }, pgGodCredentials).catch(
      () => void 0
    )
  }

  async initDb(): Promise<Connection> {
    await this.createDb()

    const modelsLoader = require("../../../loaders/models").default

    const entities = modelsLoader({}, { register: false, isTest: true })

    const migrationDir = resolve(
      join(__dirname, `..`, `..`, "..", `migrations`, `*.ts`)
    )

    const { getEnabledMigrations } = require(join(
      __dirname,
      `..`,
      `..`,
      "..",
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

    this.connection = await createConnection({
      type: "postgres",
      url: DB_FULL_URL,
      migrationsRun: true,
      entities: enabledEntities,
      migrations: enabledMigrations,
    })

    return this.connection
  }
}

export const databaseFactory = new DatabaseFactory()
