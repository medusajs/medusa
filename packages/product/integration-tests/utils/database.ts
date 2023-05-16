import { databaseOptions } from "./config"
import * as ProductModels from "@models"
import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql"
import { TSMigrationGenerator } from "@mikro-orm/migrations"

const ORMConfig: Options = {
  type: "postgresql",
  dbName: databaseOptions!.clientUrl,
  entities: Object.values(ProductModels),
  schema: databaseOptions!.schema,
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
      throw "manager entity not available"
    }

    return this.manager
  },

  async forkManager() {
    if (this.manager === null) {
      throw "manager entity not available"
    }

    return await this.manager.fork()
  },

  getORM() {
    if (this.orm === null) {
      throw "orm entity not available"
    }

    return this.orm
  },

  async setupDatabase() {
    // Initializing the ORM
    this.orm = await MikroORM.init(ORMConfig)

    if (this.orm === null) {
      throw "ORM not configured"
    }

    this.manager = await this.orm.em

    // ensure the database exists
    // drop the schema if exists
    // create the schema from scratch
    await this.orm.schema.refreshDatabase()
  },

  async clearDatabase() {
    if (this.orm === null) {
      throw "ORM not configured"
    }

    await this.orm.close()

    this.orm = null
    this.manager = null
  },
}
