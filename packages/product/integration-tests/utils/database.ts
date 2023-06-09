import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql"
import * as ProductModels from "@models"

if (typeof process.env.DB_TEMP_NAME === "undefined") {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  process.env.DB_TEMP_NAME = `medusa-integration-${tempName}`
  process.env.MEDUSA_PRODUCT_DB_SCHEMA = "medusa-product"
}

const ORMConfig: Options = {
  type: "postgresql",
  dbName: process.env.DB_TEMP_NAME,
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

    const generator = this.orm.getSchemaGenerator()
    await generator.refreshDatabase() // ensure db exists and is fresh
    await generator.clearDatabase() // removes all data
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
