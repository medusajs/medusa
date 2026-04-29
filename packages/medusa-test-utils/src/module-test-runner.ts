import { logger } from "@medusajs/framework/logger"
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
import { ulid } from "ulid"

export interface SuiteOptions<TService = unknown> {
  MikroOrmWrapper: TestDatabase
  medusaApp: any
  service: TService
  dbConfig: {
    schema: string
    clientUrl: string
  }
}

interface ModuleTestRunnerConfig<TService = any> {
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
  cwd?: string
  hooks?: {
    beforeModuleInit?: () => Promise<void>
    afterModuleInit?: (medusaApp: any, service: TService) => Promise<void>
  }
}

function createMikroOrmWrapper(options: {
  moduleModels?: (Function | DmlEntity<any, any>)[]
  resolve?: string
  dbConfig: any
  cwd?: string
}): {
  MikroOrmWrapper: TestDatabase
  models: (Function | DmlEntity<any, any>)[]
} {
  let moduleModels: (Function | DmlEntity<any, any>)[] =
    options.moduleModels ?? []

  if (!options.moduleModels) {
    const basePath = normalizeImportPathWithSource(
      options.resolve ?? options.cwd ?? process.cwd()
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

class ModuleTestRunner<TService = any> {
  private moduleName: string
  private schema: string
  private dbName: string
  private dbConfig: {
    clientUrl: string
    schema: string
    debug: boolean
  }
  private debug: boolean
  private resolve?: string
  private cwd?: string
  private moduleOptions: Record<string, any>
  private moduleDependencies?: string[]
  private joinerConfig: any[]
  private injectedDependencies: Record<string, any>
  private hooks: ModuleTestRunnerConfig<TService>["hooks"] = {}

  private connection: any = null
  private MikroOrmWrapper!: TestDatabase
  private moduleModels: (Function | DmlEntity<any, any>)[] = []
  private modulesConfig: any = {}
  private moduleOptionsConfig!: InitModulesOptions

  private shutdown: () => Promise<void> = async () => void 0
  private moduleService: any = null
  private medusaApp: any = {}

  constructor(config: ModuleTestRunnerConfig<TService>) {
    const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
    this.moduleName = config.moduleName
    const moduleName = this.moduleName ?? ulid()
    this.dbName =
      config.dbName ??
      `medusa-${moduleName.toLowerCase()}-integration-${tempName}`
    this.schema = config.schema ?? "public"
    this.debug = config.debug ?? false
    this.resolve = config.resolve
    this.cwd = config.cwd
    this.moduleOptions = config.moduleOptions ?? {}
    this.moduleDependencies = config.moduleDependencies
    this.joinerConfig = config.joinerConfig ?? []
    this.injectedDependencies = config.injectedDependencies ?? {}
    this.hooks = config.hooks ?? {}

    this.dbConfig = {
      clientUrl: getDatabaseURL(this.dbName),
      schema: this.schema,
      debug: this.debug,
    }

    this.setupProcessHandlers()
    this.initializeConfig(config.moduleModels)
  }

  private setupProcessHandlers(): void {
    process.on("SIGTERM", async () => {
      await this.cleanup()
      process.exit(0)
    })

    process.on("SIGINT", async () => {
      await this.cleanup()
      process.exit(0)
    })
  }

  private initializeConfig(moduleModels?: any[]): void {
    const moduleSdkImports = require("@medusajs/framework/modules-sdk")

    // Use a unique connection for all the entire suite
    this.connection = ModulesSdkUtils.createPgConnection(this.dbConfig)

    const { MikroOrmWrapper, models } = createMikroOrmWrapper({
      moduleModels,
      resolve: this.resolve,
      dbConfig: this.dbConfig,
      cwd: this.cwd,
    })

    this.MikroOrmWrapper = MikroOrmWrapper
    this.moduleModels = models

    this.modulesConfig = {
      [this.moduleName]: {
        definition: moduleSdkImports.ModulesDefinition[this.moduleName],
        resolve: this.resolve,
        dependencies: this.moduleDependencies,
        options: {
          database: this.dbConfig,
          ...this.moduleOptions,
          [isSharedConnectionSymbol]: true,
        },
      },
    }

    this.moduleOptionsConfig = {
      injectedDependencies: {
        [ContainerRegistrationKeys.PG_CONNECTION]: this.connection,
        [Modules.EVENT_BUS]: new MockEventBusService(),
        [ContainerRegistrationKeys.LOGGER]: console,
        [ContainerRegistrationKeys.CONFIG_MODULE]: {
          modules: this.modulesConfig,
        },
        ...this.injectedDependencies,
      },
      modulesConfig: this.modulesConfig,
      databaseConfig: this.dbConfig,
      joinerConfig: this.joinerConfig,
      preventConnectionDestroyWarning: true,
      cwd: this.cwd,
    }
  }

  private createMedusaAppProxy(): any {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return this.medusaApp?.[prop]
        },
      }
    )
  }

  private createServiceProxy(): any {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return this.moduleService?.[prop]
        },
      }
    )
  }

  public async beforeAll(): Promise<void> {
    try {
      this.setupProcessHandlers()
      process.env.LOG_LEVEL = "error"
    } catch (error) {
      await this.cleanup()
      throw error
    }
  }

  public async beforeEach(): Promise<void> {
    try {
      if (this.moduleModels.length) {
        await this.MikroOrmWrapper.setupDatabase()
      }

      if (this.hooks?.beforeModuleInit) {
        await this.hooks.beforeModuleInit()
      }

      const output = await initModules(this.moduleOptionsConfig)
      this.shutdown = output.shutdown
      this.medusaApp = output.medusaApp
      this.moduleService = output.medusaApp.modules[this.moduleName]

      if (this.hooks?.afterModuleInit) {
        await this.hooks.afterModuleInit(this.medusaApp, this.moduleService)
      }
    } catch (error) {
      logger.error("Error in beforeEach:", error?.message)
      await this.cleanup()
      throw error
    }
  }

  public async afterEach(): Promise<void> {
    try {
      if (this.moduleModels.length) {
        await this.MikroOrmWrapper.clearDatabase()
      }
      await this.shutdown()
      this.moduleService = {}
      this.medusaApp = {}
    } catch (error) {
      logger.error("Error in afterEach:", error?.message)
      throw error
    }
  }

  public async cleanup(): Promise<void> {
    try {
      process.removeAllListeners("SIGTERM")
      process.removeAllListeners("SIGINT")

      await (this.connection as any)?.context?.destroy()
      await (this.connection as any)?.destroy()

      this.moduleService = null
      this.medusaApp = null
      this.connection = null

      if (global.gc) {
        global.gc()
      }
    } catch (error) {
      logger.error("Error during cleanup:", error?.message)
    }
  }

  public getOptions(): SuiteOptions<TService> {
    return {
      MikroOrmWrapper: this.MikroOrmWrapper,
      medusaApp: this.createMedusaAppProxy(),
      service: this.createServiceProxy(),
      dbConfig: {
        schema: this.schema,
        clientUrl: this.dbConfig.clientUrl,
      },
    }
  }
}

export function moduleIntegrationTestRunner<TService = any>({
  moduleName,
  moduleModels,
  moduleOptions = {},
  moduleDependencies,
  joinerConfig = [],
  schema = "public",
  dbName,
  debug = false,
  testSuite,
  resolve,
  injectedDependencies = {},
  cwd,
  hooks,
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
  cwd?: string
  hooks?: ModuleTestRunnerConfig<TService>["hooks"]
  testSuite: (options: SuiteOptions<TService>) => void
}) {
  const runner = new ModuleTestRunner<TService>({
    moduleName,
    moduleModels,
    moduleOptions,
    moduleDependencies,
    joinerConfig,
    schema,
    dbName,
    debug,
    resolve,
    injectedDependencies,
    cwd,
    hooks,
  })

  return describe("", () => {
    let testOptions: SuiteOptions<TService>

    beforeAll(async () => {
      await runner.beforeAll()
      testOptions = runner.getOptions()
    })

    beforeEach(async () => {
      await runner.beforeEach()
    })

    afterEach(async () => {
      await runner.afterEach()
    })

    afterAll(async () => {
      // Run main cleanup
      await runner.cleanup()

      // Clean references to the test options
      for (const key in testOptions) {
        if (typeof testOptions[key] === "function") {
          testOptions[key] = null
        } else if (
          typeof testOptions[key] === "object" &&
          testOptions[key] !== null
        ) {
          Object.keys(testOptions[key]).forEach((k) => {
            testOptions[key][k] = null
          })
          testOptions[key] = null
        }
      }

      // Encourage garbage collection
      // @ts-ignore
      testOptions = null

      if (global.gc) {
        global.gc()
      }
    })

    // Run test suite with options
    testSuite(runner.getOptions())
  })
}
