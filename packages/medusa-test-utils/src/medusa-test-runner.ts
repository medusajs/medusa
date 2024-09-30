import { MedusaAppOutput } from "@medusajs/framework/modules-sdk"
import { ContainerLike, MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/framework/utils"
import { asValue } from "awilix"
import { dbTestUtilFactory, getDatabaseURL } from "./database"
import {
  applyEnvVarsToProcess,
  clearInstances,
  configLoaderOverride,
  initDb,
  migrateDatabase,
  startApp,
  syncLinks,
} from "./medusa-test-runner-utils"

export interface MedusaSuiteOptions {
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
  schema?: string
  debug?: boolean
  inApp?: boolean
  testSuite: (options: MedusaSuiteOptions) => void
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
    await syncLinks(appLoader, cwd, container)
    await clearInstances()

    let containerRes: MedusaContainer = container
    let serverShutdownRes: () => any
    let portRes: number

    loadedApplication = await appLoader.load()

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
      await syncLinks(appLoader, cwd, containerRes)
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
