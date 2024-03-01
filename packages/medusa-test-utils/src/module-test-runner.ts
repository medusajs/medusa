import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { initModules, InitModulesOptions } from "./init-modules"
import { MedusaAppOutput, ModulesDefinition } from "@medusajs/modules-sdk"
import { getDatabaseURL, getMikroOrmWrapper, TestDatabase } from "./database"

import { MockEventBusService } from "."

export interface SuiteOptions<TService = unknown> {
  MikroOrmWrapper: TestDatabase
  medusaApp: MedusaAppOutput
  service: TService
  dbConfig: {
    schema: string
    clientUrl: string
  }
}

export function moduleIntegrationTestRunner({
  moduleName,
  moduleModels,
  joinerConfig = [],
  schema = "public",
  debug = false,
  testSuite,
  injectedDependencies = {},
}: {
  moduleName: string
  moduleModels?: any[]
  joinerConfig?: any[]
  schema?: string
  dbName?: string
  injectedDependencies?: Record<string, any>
  debug?: boolean
  testSuite: <TService = unknown>(options: SuiteOptions<TService>) => () => void
}) {
  moduleModels = Object.values(require(`${process.cwd()}/src/models`))
  // migrationPath ??= process.cwd() + "/src/migrations/!(*.d).{js,ts,cjs}"

  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  const dbName = `medusa-${moduleName.toLowerCase()}-integration-${tempName}`

  const dbConfig = {
    clientUrl: getDatabaseURL(dbName),
    schema,
    debug,
  }

  // Use a unique connection for all the entire suite
  const connection = ModulesSdkUtils.createPgConnection(dbConfig)

  const MikroOrmWrapper = getMikroOrmWrapper({
    mikroOrmEntities: moduleModels,
    clientUrl: dbConfig.clientUrl,
    schema: dbConfig.schema,
  })

  const modulesConfig_ = {
    [moduleName]: {
      definition: ModulesDefinition[moduleName],
      options: {
        defaultAdapterOptions: {
          database: dbConfig,
        },
        database: dbConfig,
      },
    },
  }

  const moduleOptions: InitModulesOptions = {
    injectedDependencies: {
      [ContainerRegistrationKeys.PG_CONNECTION]: connection,
      eventBusService: new MockEventBusService(),
      [ContainerRegistrationKeys.LOGGER]: console,
      ...injectedDependencies,
    },
    modulesConfig: modulesConfig_,
    databaseConfig: dbConfig,
    joinerConfig,
    preventConnectionDestroyWarning: true,
  }

  let shutdown: () => Promise<void>
  let moduleService
  let medusaApp: MedusaAppOutput = {} as MedusaAppOutput

  const options = {
    MikroOrmWrapper,
    medusaApp: new Proxy(
      {},
      {
        get: (target, prop) => {
          return medusaApp[prop]
        },
      }
    ) as MedusaAppOutput,
    service: new Proxy(
      {},
      {
        get: (target, prop) => {
          return moduleService[prop]
        },
      }
    ),
  } as SuiteOptions

  const beforeEach_ = async () => {
    try {
      await MikroOrmWrapper.setupDatabase()
      const output = await initModules(moduleOptions)
      shutdown = output.shutdown
      medusaApp = output.medusaApp
      moduleService = output.medusaApp.modules[moduleName]
    } catch (error) {
      console.error("Error setting up database:", error)
    }
  }

  const afterEach_ = async () => {
    try {
      await MikroOrmWrapper.clearDatabase()
      await shutdown()
      moduleService = {}
      medusaApp = {} as MedusaAppOutput
    } catch (error) {
      console.error("Error tearing down database:", error)
    }
  }

  return describe("", () => {
    beforeEach(beforeEach_)
    afterEach(afterEach_)
    afterAll(async () => {
      await (connection as any).context?.destroy()
      await (connection as any).destroy()
    })

    testSuite(options)
  })
}
