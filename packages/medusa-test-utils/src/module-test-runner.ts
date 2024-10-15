import {
  ContainerRegistrationKeys,
  DmlEntity,
  isSharedConnectionSymbol,
  loadModels,
  Modules,
  ModulesSdkUtils,
  normalizeImportPathWithSource,
  toMikroOrmEntities,
} from "@medusajs/framework/utils"
import * as fs from "fs"
import { getDatabaseURL, getMikroOrmWrapper, TestDatabase } from "./database"
import { initModules, InitModulesOptions } from "./init-modules"
import { default as MockEventBusService } from "./mock-event-bus-service"

export interface SuiteOptions<TService = unknown> {
  MikroOrmWrapper: TestDatabase
  medusaApp: any
  service: TService
  dbConfig: {
    schema: string
    clientUrl: string
  }
}

function createMikroOrmWrapper(options: {
  moduleModels?: (Function | DmlEntity<any, any>)[]
  resolve?: string
  dbConfig: any
}): {
  MikroOrmWrapper: TestDatabase
  models: (Function | DmlEntity<any, any>)[]
} {
  let moduleModels: (Function | DmlEntity<any, any>)[] =
    options.moduleModels ?? []

  if (!options.moduleModels) {
    const basePath = normalizeImportPathWithSource(
      options.resolve ?? process.cwd()
    )

    const modelsPath = fs.existsSync(`${basePath}/dist/models`)
      ? "/dist/models"
      : fs.existsSync(`${basePath}/models`)
      ? "/models"
      : ""

    if (modelsPath) {
      moduleModels = loadModels(`${basePath}${modelsPath}`)
    } else {
      moduleModels = []
    }
  }

  moduleModels = toMikroOrmEntities(moduleModels)

  const MikroOrmWrapper = getMikroOrmWrapper({
    mikroOrmEntities: moduleModels,
    clientUrl: options.dbConfig.clientUrl,
    schema: options.dbConfig.schema,
  })

  return { MikroOrmWrapper, models: moduleModels }
}

export function moduleIntegrationTestRunner<TService = any>({
  moduleName,
  moduleModels,
  moduleOptions = {},
  moduleDependencies,
  joinerConfig = [],
  schema = "public",
  debug = false,
  testSuite,
  resolve,
  injectedDependencies = {},
}: {
  moduleName: string
  moduleModels?: any[]
  moduleOptions?: Record<string, any>
  moduleDependencies?: string[]
  joinerConfig?: any[]
  schema?: string
  dbName?: string
  injectedDependencies?: Record<string, any>
  resolve?: string
  debug?: boolean
  testSuite: (options: SuiteOptions<TService>) => void
}) {
  const moduleSdkImports = require("@medusajs/framework/modules-sdk")

  process.env.LOG_LEVEL = "error"

  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  const dbName = `medusa-${moduleName.toLowerCase()}-integration-${tempName}`

  const dbConfig = {
    clientUrl: getDatabaseURL(dbName),
    schema,
    debug,
  }

  // Use a unique connection for all the entire suite
  const connection = ModulesSdkUtils.createPgConnection(dbConfig)

  const { MikroOrmWrapper, models } = createMikroOrmWrapper({
    moduleModels,
    resolve,
    dbConfig,
  })

  moduleModels = models

  const modulesConfig_ = {
    [moduleName]: {
      definition: moduleSdkImports.ModulesDefinition[moduleName],
      resolve,
      dependencies: moduleDependencies,
      options: {
        database: dbConfig,
        ...moduleOptions,
        [isSharedConnectionSymbol]: true,
      },
    },
  }

  const moduleOptions_: InitModulesOptions = {
    injectedDependencies: {
      [ContainerRegistrationKeys.PG_CONNECTION]: connection,
      [Modules.EVENT_BUS]: new MockEventBusService(),
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
  let medusaApp = {}

  const options = {
    MikroOrmWrapper,
    medusaApp: new Proxy(
      {},
      {
        get: (target, prop) => {
          return medusaApp[prop]
        },
      }
    ),
    service: new Proxy(
      {},
      {
        get: (target, prop) => {
          return moduleService[prop]
        },
      }
    ),
    dbConfig: {
      schema,
      clientUrl: dbConfig.clientUrl,
    },
  } as SuiteOptions<TService>

  const beforeEach_ = async () => {
    if (moduleModels.length) {
      await MikroOrmWrapper.setupDatabase()
    }
    const output = await initModules(moduleOptions_)
    shutdown = output.shutdown
    medusaApp = output.medusaApp
    moduleService = output.medusaApp.modules[moduleName]
  }

  const afterEach_ = async () => {
    if (moduleModels.length) {
      await MikroOrmWrapper.clearDatabase()
    }
    await shutdown()
    moduleService = {}
    medusaApp = {}
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
