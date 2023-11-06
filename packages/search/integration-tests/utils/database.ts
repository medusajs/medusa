import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { MikroORM, SqlEntityManager } from "@mikro-orm/postgresql"
import * as ProductModels from "@models"
import * as process from "process"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
export const DB_URL = `postgres://${DB_USERNAME}${
  DB_PASSWORD ? `:${DB_PASSWORD}` : ""
}@${DB_HOST}/${DB_NAME}`

interface TestDatabase {
  orm: MikroORM | null
  manager: SqlEntityManager | null

  setupDatabase(): Promise<void>
  clearDatabase(): Promise<void>
  getManager(): SqlEntityManager
  forkManager(): SqlEntityManager
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

  forkManager() {
    if (this.manager === null) {
      throw new Error("manager entity not available")
    }

    return this.manager.fork()
  },

  getORM() {
    if (this.orm === null) {
      throw new Error("orm entity not available")
    }

    return this.orm
  },

  async setupDatabase() {
    // Initializing the ORM
    this.orm = await MikroORM.init({
      type: "postgresql",
      clientUrl: DB_URL,
      entities: Object.values(ProductModels),
      schema: process.env.MEDUSA_SEARCH_DB_SCHEMA,
      debug: false,
      migrations: {
        tableName: "mikro_orm_migrations",
        path: "./dist/migrations",
        silent: true,
        dropTables: true,
        transactional: true,
        allOrNothing: true,
        safe: false,
        generator: TSMigrationGenerator,
      },
    })

    if (this.orm === null) {
      throw new Error("ORM not configured")
    }

    this.manager = this.orm.em

    try {
      await this.orm.getSchemaGenerator().ensureDatabase()
    } catch (err) {}

    await this.manager?.execute(
      `CREATE SCHEMA IF NOT EXISTS "${
        process.env.MEDUSA_SEARCH_DB_SCHEMA ?? "public"
      }";`
    )

    const pendingMigrations = await this.orm
      .getMigrator()
      .getPendingMigrations()

    if (pendingMigrations && pendingMigrations.length > 0) {
      await this.orm
        .getMigrator()
        .up({ migrations: pendingMigrations.map((m) => m.name!) })
    }
  },

  async clearDatabase() {
    if (this.orm === null) {
      throw new Error("ORM not configured")
    }

    await this.manager?.execute(
      `DROP SCHEMA IF EXISTS "${
        process.env.MEDUSA_SEARCH_DB_SCHEMA ?? "public"
      }" CASCADE;`
    )

    await this.manager?.execute(
      `CREATE SCHEMA IF NOT EXISTS "${
        process.env.MEDUSA_SEARCH_DB_SCHEMA ?? "public"
      }";`
    )

    try {
      await this.orm.close()
    } catch {}

    this.orm = null
    this.manager = null
  },
}
