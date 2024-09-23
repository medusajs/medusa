import { MedusaAppOutput } from "@medusajs/modules-sdk"
import { ContainerLike, MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import { asValue } from "awilix"
import { createDatabase, dropDatabase } from "pg-god"
import { getDatabaseURL } from "./database"
import { startApp } from "./medusa-test-runner-utils/bootstrap-app"
import { clearInstances } from "./medusa-test-runner-utils/clear-instances"
import { configLoaderOverride } from "./medusa-test-runner-utils/config"
import {
  initDb,
  migrateDatabase,
  syncLinks,
} from "./medusa-test-runner-utils/use-db"
import { applyEnvVarsToProcess } from "./medusa-test-runner-utils/utils"

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
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

export interface MedusaSuiteOptions<TService = unknown> {
  dbConnection: any // knex instance
  getContainer: () => MedusaContainer
  api: any
  dbUtils: {
    create: (dbName: string) => Promise<void>
    teardown: (options: { schema?: string }) => Promise<void>
    shutdown: (dbName: string) => Promise<void>
  }
  dbConfig: {
    dbName: string
    schema: string
    clientUrl: string
  }
  getMedusaApp: () => MedusaAppOutput
}

export function medusaIntegrationTestRunner({
  moduleName,
  dbName,
  medusaConfigFile,
  loadApplication,
  schema = "public",
  env = {},
  debug = false,
  inApp = false,
  testSuite,
}: {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  medusaConfigFile?: string
  loadApplication?: boolean
  schema?: string
  debug?: boolean
  inApp?: boolean
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

  const cwd = medusaConfigFile ?? process.cwd()

  let shutdown = async () => void 0
  const dbUtils = dbTestUtilFactory()
  let globalContainer: ContainerLike
  let apiUtils: any
  let loadedApplication: any

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
    getMedusaApp: () => loadedApplication,
    getContainer: () => globalContainer,
    dbConfig: {
      dbName,
      schema,
      clientUrl: dbConfig.clientUrl,
    },
    dbUtils,
  } as MedusaSuiteOptions

  let isFirstTime = true

  const beforeAll_ = async () => {
    await configLoaderOverride(cwd, dbConfig)
    applyEnvVarsToProcess(env)

    const { logger, container, MedusaAppLoader } = await import(
      "@medusajs/framework"
    )
    const appLoader = new MedusaAppLoader()
    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
    })

    try {
      console.log(`Creating database ${dbName}`)
      await dbUtils.create(dbName)
      dbUtils.pgConnection_ = await initDb()
    } catch (error) {
      console.error("Error initializing database", error?.message)
      throw error
    }

    console.log(`Migrating database with core migrations and links ${dbName}`)
    await migrateDatabase(appLoader)
    await syncLinks(appLoader)
    await clearInstances()

    let containerRes: MedusaContainer = container
    let serverShutdownRes: () => any
    let portRes: number

    if (loadApplication) {
      loadedApplication = await appLoader.load()
    }

    try {
      const {
        shutdown = () => void 0,
        container: appContainer,
        port,
      } = await startApp({
        cwd,
        env,
      })

      containerRes = appContainer
      serverShutdownRes = shutdown
      portRes = port
    } catch (error) {
      console.error("Error starting the app", error?.message)
      throw error
    }

    /**
     * Run application migrations and sync links when inside
     * an application
     */
    if (inApp) {
      console.log(`Migrating database with core migrations and links ${dbName}`)
      await migrateDatabase(appLoader)
      await syncLinks(appLoader)
    }

    const { default: axios } = (await import("axios")) as any

    const cancelTokenSource = axios.CancelToken.source()

    globalContainer = containerRes
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
      const { MedusaAppLoader } = await import("@medusajs/framework")

      const medusaAppLoader = new MedusaAppLoader({
        container: copiedContainer,
      })
      await medusaAppLoader.runModulesLoader()
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
