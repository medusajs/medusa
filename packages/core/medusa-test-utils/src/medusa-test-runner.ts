import { ContainerLike, MedusaContainer } from "@medusajs/types"
import { createMedusaContainer } from "@medusajs/utils"
import { createDatabase, dropDatabase } from "pg-god"
import { getDatabaseURL } from "./database"
import { startBootstrapApp } from "./medusa-test-runner-utils/bootstrap-app"
import { initDb } from "./medusa-test-runner-utils/use-db"

const axios = require("axios").default

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

const dbTestUtilFactory = (): any => ({
  db_: null,
  pgConnection_: null,

  clear: async function () {
    this.db_?.synchronize(true)
  },

  create: async function (dbName: string) {
    await createDatabase({ databaseName: dbName }, pgGodCredentials)
  },

  teardown: async function ({
    forceDelete,
    schema,
  }: { forceDelete?: string[]; schema?: string } = {}) {
    forceDelete ??= []
    if (!this.db_) {
      return
    }

    const manager = this.db_.manager

    schema ??= "public"

    await manager.query(`SET session_replication_role = 'replica';`)
    const tableNames = await manager.query(`SELECT table_name
                                            FROM information_schema.tables
                                            WHERE table_schema = '${schema}';`)

    for (const { table_name } of tableNames) {
      await manager.query(`DELETE
                           FROM ${schema}."${table_name}";`)
    }

    await manager.query(`SET session_replication_role = 'origin';`)
  },

  shutdown: async function (dbName: string) {
    await this.db_?.destroy()
    await this.pgConnection_?.context?.destroy()
    await this.pgConnection_?.destroy()

    return await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
  },
})

export interface MedusaSuiteOptions<TService = unknown> {
  dbUtils: any
  dbConnection: any // Legacy typeorm connection
  getContainer: () => MedusaContainer
  api: any
  dbConfig: {
    dbName: string
    schema: string
    clientUrl: string
  }
}

export function medusaIntegrationTestRunner({
  moduleName,
  dbName,
  schema = "public",
  env = {},
  force_modules_migration = false,
  debug = false,
  testSuite,
}: {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  schema?: string
  debug?: boolean
  force_modules_migration?: boolean
  testSuite: <TService = unknown>(options: MedusaSuiteOptions<TService>) => void
}) {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  moduleName = moduleName ?? Math.random().toString(36).substring(7)
  dbName ??= `medusa-${moduleName.toLowerCase()}-integration-${tempName}`

  let dbConfig = {
    dbName,
    clientUrl: getDatabaseURL(dbName),
    schema,
    debug,
  }

  const originalConfigLoader =
    require("@medusajs/medusa/dist/loaders/config").default
  require("@medusajs/medusa/dist/loaders/config").default = (
    rootDirectory: string
  ) => {
    const config = originalConfigLoader(rootDirectory)
    config.projectConfig.database_url = dbConfig.clientUrl
    config.projectConfig.database_driver_options = dbConfig.clientUrl.includes(
      "localhost"
    )
      ? {}
      : {
          connection: {
            ssl: { rejectUnauthorized: false },
          },
          idle_in_transaction_session_timeout: 20000,
        }
    return config
  }

  const cwd = process.cwd()

  let shutdown = async () => void 0
  let dbUtils = dbTestUtilFactory()
  let container: ContainerLike
  let apiUtils: any

  let options = {
    dbUtils,
    api: new Proxy(
      {},
      {
        get: (target, prop) => {
          return apiUtils[prop]
        },
      }
    ),
    dbConnection: new Proxy(
      {},
      {
        get: (target, prop) => {
          return dbUtils.db_[prop]
        },
      }
    ),
    getContainer: () => container,
  } as MedusaSuiteOptions

  let isFirstTime = true

  const beforeAll_ = async () => {
    await dbUtils.create(dbName)

    let dataSourceRes
    let pgConnectionRes

    try {
      const { dbDataSource, pgConnection } = await initDb({
        cwd,
        env,
        force_modules_migration,
        database_extra: {},
        dbUrl: dbConfig.clientUrl,
        dbSchema: dbConfig.schema,
      })

      dataSourceRes = dbDataSource
      pgConnectionRes = pgConnection
    } catch (error) {
      console.error("Error initializing database", error?.message)
      throw error
    }

    dbUtils.db_ = dataSourceRes
    dbUtils.pgConnection_ = pgConnectionRes

    let containerRes
    let serverShutdownRes
    let portRes
    try {
      const {
        shutdown = () => void 0,
        container,
        port,
      } = await startBootstrapApp({
        cwd,
        env,
      })

      containerRes = container
      serverShutdownRes = shutdown
      portRes = port
    } catch (error) {
      console.error("Error starting the app", error?.message)
      throw error
    }

    const cancelTokenSource = axios.CancelToken.source()

    container = containerRes
    shutdown = async () => {
      await serverShutdownRes()
      cancelTokenSource.cancel("Request canceled by shutdown")
    }

    apiUtils = axios.create({
      baseURL: `http://localhost:${portRes}`,
      cancelToken: cancelTokenSource.token,
    })
  }

  const beforeEach_ = async () => {
    // The beforeAll already run everything, so lets not re run the loaders for the first iteration
    if (isFirstTime) {
      isFirstTime = false
      return
    }

    const container = options.getContainer()
    const copiedContainer = createMedusaContainer({}, container)

    try {
      const medusaAppLoaderRunner =
        require("@medusajs/medusa/dist/loaders/medusa-app").runModulesLoader
      await medusaAppLoaderRunner({
        container: copiedContainer,
        configModule: container.resolve("configModule"),
      })
    } catch (error) {
      console.error("Error runner modules loaders", error?.message)
      throw error
    }
  }

  const afterEach_ = async () => {
    try {
      await dbUtils.teardown({ schema })
    } catch (error) {
      console.error("Error tearing down database:", error?.message)
      throw error
    }
  }

  return describe("", () => {
    beforeAll(beforeAll_)
    beforeEach(beforeEach_)
    afterEach(afterEach_)
    afterAll(async () => {
      await dbUtils.shutdown(dbName)
      await shutdown()
    })

    testSuite(options!)
  })
}
