import { ContainerLike } from "@medusajs/modules-sdk"
import { getDatabaseURL } from "./database"
import { DbTestUtil, initDb } from "./environment-helpers/use-db"
import { startBootstrapApp } from "./environment-helpers/bootstrap-app"
import { default as axios } from "axios"

export interface MedusaSuiteOptions<TService = unknown> {
  dbUtils: any
  dbConnection: any
  getContainer: () => ContainerLike
  service: TService
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
  testSuite,
}: {
  moduleName?: string
  env?: Record<string, string>
  dbName?: string
  schema?: string
  testSuite: <TService = unknown>(
    options: MedusaSuiteOptions<TService>
  ) => () => void
}) {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  moduleName = moduleName ?? Math.random().toString(36).substring(7)
  dbName ??= `medusa-${moduleName.toLowerCase()}-integration-${tempName}`

  const dbConfig = {
    dbName,
    clientUrl: getDatabaseURL(dbName),
    schema,
  }

  // Intercept call to this utils to apply the unique client url for the current suite
  const originalCreatePgConnection =
    require("@medusajs/utils/dist/modules-sdk/create-pg-connection").createPgConnection
  require("@medusajs/utils/dist/modules-sdk/create-pg-connection").createPgConnection =
    (options: any) => {
      return originalCreatePgConnection({
        ...options,
        clientUrl: dbConfig.clientUrl,
      })
    }

  const cwd = process.cwd()

  let shutdown: () => Promise<void>
  let dbUtils = { ...DbTestUtil }
  let dbConnection: any
  let container: ContainerLike
  let apiUtils: any

  const options = {
    dbUtils: new Proxy(
      {},
      {
        get: (target, prop) => {
          return dbUtils[prop]
        },
      }
    ),
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
          return dbConnection[prop]
        },
      }
    ),
    getContainer: () => container,
  } as MedusaSuiteOptions

  const beforeAll_ = async () => {
    try {
      dbConnection = await initDb({
        cwd,
        env,
        dbUrl: dbConfig.clientUrl,
        dbSchema: dbConfig.schema,
        dbName: dbConfig.dbName,
        dbTestUtils: dbUtils,
      } as any)
      shutdown = await startBootstrapApp({
        cwd,
        env,
        setContainerCb: (container_) => {
          container = container_
        },
        setPortCb: (port) => {
          apiUtils = axios.create({ baseURL: `http://localhost:${port}` })
        },
      })
    } catch (error) {
      console.error("Error setting up database:", error)
    }
  }

  const beforeEach_ = async () => {
    try {
      await dbUtils.teardown({ forceDelete: [], schema })
    } catch (error) {
      console.error("Error tearing down database:", error)
    }
  }

  return describe("", () => {
    beforeAll(beforeAll_)
    beforeEach(beforeEach_)
    afterAll(async () => {
      await dbUtils.shutdown(dbName)
      await shutdown()
    })

    testSuite(options)
  })
}
