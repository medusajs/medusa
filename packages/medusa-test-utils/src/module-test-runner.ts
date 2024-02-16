import { getDatabaseURL, getMikroOrmWrapper, TestDatabase } from "./database"
import { MedusaAppOutput, ModulesDefinition } from "@medusajs/modules-sdk"
import { initModules, InitModulesOptions } from "./init-modules"

export interface SuiteOptions<TService = unknown> {
  MikroOrmWrapper: TestDatabase
  medusaApp: MedusaAppOutput
  service: TService
}

export function moduleIntegrationTestRunner({
  moduleName,
  moduleModels,
  joinerConfig = [],
  describeName = moduleName,
  schema = "public",
  migrationPath,
  testSuite,
}: {
  moduleName: string
  moduleModels?: any[]
  joinerConfig?: any[]
  migrationPath?: string
  describeName?: string
  schema?: string
  dbName: string
  testSuite: <TService = unknown>(options: SuiteOptions<TService>) => () => void
}) {
  moduleModels = Object.values(require(`${process.cwd()}/src/models`))
  migrationPath ??= process.cwd() + "/src/migrations/!(*.d).{js,ts,cjs}"

  if (typeof process.env.DB_TEMP_NAME === "undefined") {
    const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
    process.env.DB_TEMP_NAME = `medusa-${moduleName.toLowerCase()}-integration-${tempName}`
  }

  const schemaEnvKey = `MEDUSA_${moduleName.toUpperCase()}_DB_SCHEMA`
  process.env[schemaEnvKey] = schema

  const MikroOrmWrapper = getMikroOrmWrapper(
    moduleModels,
    migrationPath || null,
    process.env[schemaEnvKey]
  )

  const DB_URL = getDatabaseURL()

  const modulesConfig_ = {
    [moduleName]: {
      definition: ModulesDefinition[moduleName],
      options: {
        defaultAdapterOptions: {
          database: {
            clientUrl: DB_URL,
            schema: process.env[schemaEnvKey],
          },
        },
      },
    },
  }

  const moduleOptions: InitModulesOptions = {
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env[schemaEnvKey],
    },
    joinerConfig,
  }

  let shutdown: () => Promise<void>
  let moduleService = {}
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
    await MikroOrmWrapper.setupDatabase()
    const output = await initModules(moduleOptions)
    shutdown = output.shutdown
    medusaApp = output.medusaApp
    moduleService = output.medusaApp.modules[moduleName]

    return output.medusaApp
  }

  const afterEach_ = async () => {
    await MikroOrmWrapper.clearDatabase()
    await shutdown()
    moduleService = {}
    medusaApp = {} as MedusaAppOutput
  }

  return describe("", () => {
    beforeEach(beforeEach_)
    afterEach(afterEach_)

    testSuite(options)
  })
}
