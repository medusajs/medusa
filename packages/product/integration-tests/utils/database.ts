import { moduleOptions } from "./config"
import * as ProductModels from "../../src/models"
import { Options, SqlEntityManager, MikroORM } from "@mikro-orm/postgresql"

const ORMConfig: Options = {
  type: "postgresql",
  dbName: moduleOptions.database.clientUrl,
  entities: Object.values(ProductModels),
  debug: false,
  migrations: {
    silent: true
  }
}

interface TestDatabase {
  orm: MikroORM | null
  manager: SqlEntityManager | null

  setupDatabase(): Promise<void>
  clearDatabase(): Promise<void>
  getManager(): SqlEntityManager
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

    this.manager = this.orm.em.fork()

    // Ensures that the database is created
    await this.orm.schema.dropDatabase(moduleOptions.database.clientUrl)
    await this.orm.schema.ensureDatabase()
    // Runs all the migration files
    await this.orm.getMigrator().up()
  },

  async clearDatabase() {
    if (this.orm === null) {
      throw "ORM not configured"
    }

    await this.orm.schema.dropDatabase(moduleOptions.database.clientUrl)
    await this.orm.close()

    this.orm = null
    this.manager = null
  },
}
