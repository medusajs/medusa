import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql"
import * as ProductModels from "@models"
import * as process from "process"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
export const DB_URL = `postgres://${DB_USERNAME}${
  DB_PASSWORD ? `:${DB_PASSWORD}` : ""
}@${DB_HOST}/${DB_NAME}`

const ORMConfig: Options = {
  type: "postgresql",
  clientUrl: DB_URL,
  entities: Object.values(ProductModels),
  schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  debug: false,
  migrations: {
    path: "../../src/migrations",
    pathTs: "../../src/migrations",
    glob: "!(*.d).{js,ts}",
    silent: true,
    dropTables: true,
    transactional: true,
    allOrNothing: true,
    safe: false,
    generator: TSMigrationGenerator,
  },
}

interface TestDatabase {
  orm: MikroORM | null
  manager: SqlEntityManager | null

  setupDatabase(): Promise<void>
  clearDatabase(): Promise<void>
  getManager(): SqlEntityManager
  forkManager(): Promise<SqlEntityManager>
  getORM(): MikroORM
}

export const TestDatabase: TestDatabase = {
  orm: null,
  manager: null,

  getManager() {
    if (this.manager === null) {
      throw new Error("manager entity not available")
    }

    return this.manager
  },

  async forkManager() {
    if (this.manager === null) {
      throw new Error("manager entity not available")
    }

    return await this.manager.fork()
  },

  getORM() {
    if (this.orm === null) {
      throw new Error("orm entity not available")
    }

    return this.orm
  },

  async setupDatabase() {
    // Initializing the ORM
    this.orm = await MikroORM.init(ORMConfig)

    if (this.orm === null) {
      throw new Error("ORM not configured")
    }

    this.manager = await this.orm.em

    await this.orm.schema.refreshDatabase() // ensure db exists and is fresh
  },

  async clearDatabase() {
    if (this.orm === null) {
      throw new Error("ORM not configured")
    }

    await this.orm.close()

    this.orm = null
    this.manager = null
  },
}
