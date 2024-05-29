import { ContainerLike, MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import { createDatabase, dropDatabase } from "pg-god"
import { getDatabaseURL } from "./database"
import { startApp } from "./medusa-test-runner-utils/bootstrap-app"
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
  pgConnection_: null,

  create: async function (dbName: string) {
    await createDatabase({ databaseName: dbName }, pgGodCredentials)
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

export interface MedusaSuiteOptions<TService = unknown> {
  dbConnection: any // knex instance
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
  debug = false,
  testSuite,
}: {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  schema?: string
  debug?: boolean
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
    config.projectConfig.databaseUrl = dbConfig.clientUrl
    config.projectConfig.databaseDriverOptions = dbConfig.clientUrl.includes(
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
  const dbUtils = dbTestUtilFactory()
  let container: ContainerLike
  let apiUtils: any

  let options = {
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
          return dbUtils.pgConnection_[prop]
        },
      }
    ),
    getContainer: () => container,
    dbConfig: {
      dbName,
      schema,
      clientUrl: dbConfig.clientUrl,
    },
  } as MedusaSuiteOptions

  let isFirstTime = true

  const beforeAll_ = async () => {
    await dbUtils.create(dbName)

    try {
      dbUtils.pgConnection_ = await initDb({
        cwd,
        env,
      })
    } catch (error) {
      console.error("Error initializing database", error?.message)
      throw error
    }

    let containerRes
    let serverShutdownRes
    let portRes

    try {
      const {
        shutdown = () => void 0,
        container,
        port,
      } = await startApp({
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
        configModule: container.resolve(
          ContainerRegistrationKeys.CONFIG_MODULE
        ),
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
