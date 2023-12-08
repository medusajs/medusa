import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql"
import * as process from "process"

export function getDatabaseURL(): string {
  const DB_HOST = process.env.DB_HOST ?? "localhost"
  const DB_USERNAME = process.env.DB_USERNAME ?? ""
  const DB_PASSWORD = process.env.DB_PASSWORD
  const DB_NAME = process.env.DB_TEMP_NAME

  return `postgres://${DB_USERNAME}${
    DB_PASSWORD ? `:${DB_PASSWORD}` : ""
  }@${DB_HOST}/${DB_NAME}`
}

export function getMikroOrmConfig(
  mikroOrmEntities: any[],
  pathToMigrations: string
): Options {
  const DB_URL = getDatabaseURL()

  return {
    type: "postgresql",
    clientUrl: DB_URL,
    entities: Object.values(mikroOrmEntities),
    schema: process.env.MEDUSA_DB_SCHEMA,
    debug: false,
    migrations: {
      path: pathToMigrations,
      pathTs: pathToMigrations,
      glob: "!(*.d).{js,ts}",
      silent: true,
      dropTables: true,
      transactional: true,
      allOrNothing: true,
      safe: false,
      generator: TSMigrationGenerator,
    },
  }
}

export interface TestDatabase {
  orm: MikroORM | null
  manager: SqlEntityManager | null

  setupDatabase(): Promise<void>
  clearDatabase(): Promise<void>
  getManager(): SqlEntityManager
  forkManager(): SqlEntityManager
  getOrm(): MikroORM
}

export function getMikroOrmWrapper(
  mikroOrmEntities: any[],
  pathToMigrations: string
): TestDatabase {
  return {
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

    getOrm() {
      if (this.orm === null) {
        throw new Error("orm entity not available")
      }

      return this.orm
    },

    async setupDatabase() {
      const OrmConfig = getMikroOrmConfig(mikroOrmEntities, pathToMigrations)

      // Initializing the ORM
      this.orm = await MikroORM.init(OrmConfig)

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
}
