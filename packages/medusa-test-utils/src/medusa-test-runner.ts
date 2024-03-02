import { ContainerLike } from "@medusajs/modules-sdk"
import {getDatabaseURL} from './database'
import {initDb} from './environment-helpers/use-db'
import {startBootstrapApp} from './environment-helpers/bootstrap-app'
import {getContainer} from './environment-helpers/use-container'
import {useApi} from "./environment-helpers/use-api"

export interface MedusaSuiteOptions<TService = unknown> {
  dbUtils: any
  dbConnection: any
  container: ContainerLike
  service: TService
  apiUtils: any
  dbConfig: {
    dbName: string
    schema: string
    clientUrl: string
  }
}

export function medusaIntegrationTestRunner({
  moduleName,
  dbName,
  schema = 'public',
  env = {},
  testSuite,
}: {
  moduleName: string
  env?: Record<string, string>
  dbName?: string
  schema?: string
  testSuite: <TService = unknown>(options: MedusaSuiteOptions<TService>) => () => void
}) {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  dbName ??= `medusa-${moduleName.toLowerCase()}-integration-${tempName}`

  const dbConfig = {
    dbName,
    clientUrl: getDatabaseURL(dbName),
    schema,
  }

  const cwd = process.cwd()
    
  let shutdown: () => Promise<void>
  let moduleService
  let dbUtils: any
  let dbConnection: any
  let container: ContainerLike
  let apiUtils: any

  const options = {
    dbUtils: new Proxy({}, {
        get: (target, prop) => {
            return dbUtils[prop]
        },
    }),
    apiUtils: new Proxy({}, {
        get: (target, prop) => {
            return apiUtils[prop]
        },
    }),
    dbConnection: new Proxy({}, {
        get: (target, prop) => {
            return dbConnection[prop]
        },
    }),
    container: new Proxy({}, {
        get: (target, prop) => {
            return container[prop]
        },
    }),
    service: new Proxy(
      {},
      {
        get: (target, prop) => {
          return moduleService[prop]
        },
      }
    ),
  } as MedusaSuiteOptions

  const beforeEach_ = async () => {
    try {
        dbConnection = await initDb({ cwd, env, dbUrl: dbConfig.clientUrl, dbSchema: dbConfig.schema, dbName: dbConfig.dbName } as any)
        shutdown = await startBootstrapApp({ cwd, env })
        const appContainer = getContainer()! as ContainerLike
        moduleService = moduleName && appContainer.resolve(moduleName)
        apiUtils = useApi() as any
    } catch (error) {
      console.error("Error setting up database:", error)
    }
  }

  const afterEach_ = async () => {
    try {
      await dbUtils.teardown()
    } catch (error) {
      console.error("Error tearing down database:", error)
    }
  }

  return describe("", () => {
    beforeEach(beforeEach_)
    afterEach(afterEach_)
    afterAll(async () => {
        await dbUtils.shutdown()
        await shutdown()
    })

    testSuite(options)
  })
}
