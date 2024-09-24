import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql"
import { createDatabase, dropDatabase } from "pg-god"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

export function getDatabaseURL(dbName?: string): string {
  const DB_HOST = process.env.DB_HOST ?? "localhost"
  const DB_USERNAME = process.env.DB_USERNAME ?? ""
  const DB_PASSWORD = process.env.DB_PASSWORD
  const DB_NAME = dbName ?? process.env.DB_TEMP_NAME

  return `postgres://${DB_USERNAME}${
    DB_PASSWORD ? `:${DB_PASSWORD}` : ""
  }@${DB_HOST}/${DB_NAME}`
}

export function getMikroOrmConfig({
  mikroOrmEntities,
  pathToMigrations,
  clientUrl,
  schema,
}: {
  mikroOrmEntities: any[]
  pathToMigrations?: string
  clientUrl?: string
  schema?: string
}): Options {
  const DB_URL = clientUrl ?? getDatabaseURL()

  return {
    type: "postgresql",
    clientUrl: DB_URL,
    entities: Object.values(mikroOrmEntities),
    schema: schema ?? process.env.MEDUSA_DB_SCHEMA,
    debug: false,
    pool: {
      min: 2,
    },
    migrations: {
      pathTs: pathToMigrations,
      silent: true,
    },
  }
}

export interface TestDatabase {
  mikroOrmEntities: any[]
  pathToMigrations?: string
  schema?: string
  clientUrl?: string

  orm: MikroORM | null
  manager: SqlEntityManager | null

  setupDatabase(): Promise<void>
  clearDatabase(): Promise<void>
  getManager(): SqlEntityManager
  forkManager(): SqlEntityManager
  getOrm(): MikroORM
}

export function getMikroOrmWrapper({
  mikroOrmEntities,
  pathToMigrations,
  clientUrl,
  schema,
}: {
  mikroOrmEntities: any[]
  pathToMigrations?: string
  clientUrl?: string
  schema?: string
}): TestDatabase {
  return {
    mikroOrmEntities,
    pathToMigrations,
    clientUrl: clientUrl ?? getDatabaseURL(),
    schema: schema ?? process.env.MEDUSA_DB_SCHEMA,

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
      const OrmConfig = getMikroOrmConfig({
        mikroOrmEntities: this.mikroOrmEntities,
        pathToMigrations: this.pathToMigrations,
        clientUrl: this.clientUrl,
        schema: this.schema,
      })

      // Initializing the ORM
      this.orm = await MikroORM.init(OrmConfig)

      this.manager = this.orm.em

      try {
        await this.orm.getSchemaGenerator().ensureDatabase()
      } catch (err) {
        console.log(err)
      }

      await this.manager?.execute(
        `CREATE SCHEMA IF NOT EXISTS "${this.schema ?? "public"}";`
      )

      const pendingMigrations = await this.orm
        .getMigrator()
        .getPendingMigrations()

      if (pendingMigrations && pendingMigrations.length > 0) {
        await this.orm
          .getMigrator()
          .up({ migrations: pendingMigrations.map((m) => m.name!) })
      } else {
        await this.orm.schema.refreshDatabase() // ensure db exists and is fresh
      }
    },

    async clearDatabase() {
      if (this.orm === null) {
        throw new Error("ORM not configured")
      }

      await this.manager?.execute(
        `DROP SCHEMA IF EXISTS "${this.schema ?? "public"}" CASCADE;`
      )

      await this.manager?.execute(
        `CREATE SCHEMA IF NOT EXISTS "${this.schema ?? "public"}";`
      )

      try {
        await this.orm.close()
      } catch {}

      this.orm = null
      this.manager = null
    },
  }
}

export const dbTestUtilFactory = (): any => ({
  pgConnection_: null,

  create: async function (dbName: string) {
    await createDatabase(
      { databaseName: dbName, errorIfExist: false },
      pgGodCredentials
    )
  },

  teardown: async function ({ schema }: { schema?: string } = {}) {
    if (!this.pgConnection_) {
      return
    }

    const runRawQuery = this.pgConnection_.raw.bind(this.pgConnection_)

    schema ??= "public"

    await runRawQuery(`SET session_replication_role = 'replica';`)
    const { rows: tableNames } = await runRawQuery(`SELECT table_name
                                            FROM information_schema.tables
                                            WHERE table_schema = '${schema}';`)

    for (const { table_name } of tableNames) {
      await runRawQuery(`DELETE
                           FROM ${schema}."${table_name}";`)
    }

    await runRawQuery(`SET session_replication_role = 'origin';`)
  },

  shutdown: async function (dbName: string) {
    await this.pgConnection_?.context?.destroy()
    await this.pgConnection_?.destroy()

    return await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
  },
})
