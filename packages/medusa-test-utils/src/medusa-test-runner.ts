import { asValue } from "@medusajs/framework/awilix"
import { logger } from "@medusajs/framework/logger"
import { Migrator } from "@medusajs/framework/migrations"
import { MedusaAppOutput } from "@medusajs/framework/modules-sdk"
import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  mergePluginModules,
} from "@medusajs/framework/utils"
import { dbTestUtilFactory, getDatabaseURL } from "./database"
import {
  applyEnvVarsToProcess,
  clearInstances,
  closeWaitingroomClient,
  configLoaderOverride,
  formatError,
  initDb,
  migrateDatabase,
  startApp,
  syncLinks,
} from "./medusa-test-runner-utils"
import { waitWorkflowExecutions } from "./medusa-test-runner-utils/wait-workflow-executions"
import { ulid } from "ulid"

export interface MedusaSuiteOptions {
  dbConnection: any // knex instance
  getContainer: () => MedusaContainer
  api: any
  dbUtils: {
    create: (dbName: string) => Promise<void>
    snapshot: (options?: { templateName?: string }) => Promise<void>
    restore: (options?: { templateName?: string }) => Promise<void>
    teardown: (options: { schema?: string }) => Promise<void>
    shutdown: (dbName: string) => Promise<void>
  }
  dbConfig: {
    dbName: string
    schema: string
    clientUrl: string
  }
  getMedusaApp: () => MedusaAppOutput
  utils: {
    waitWorkflowExecutions: () => Promise<void>
  }
}

interface TestRunnerConfig {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  medusaConfigFile?: string
  schema?: string
  debug?: boolean
  inApp?: boolean
  hooks?: {
    beforeServerStart?: (container: MedusaContainer) => Promise<void>
  }
  cwd?: string
}

class MedusaTestRunner {
  private dbName: string
  private dbTemplateName: string
  private schema: string
  private modulesConfigPath: string
  private cwd: string
  private env: Record<string, any>
  private debug: boolean
  // @ts-ignore
  private inApp: boolean

  private dbUtils: ReturnType<typeof dbTestUtilFactory>
  private dbConfig: {
    dbName: string
    clientUrl: string
    schema: string
    debug: boolean
  }

  private globalContainer: MedusaContainer | null = null
  private apiUtils: any = null
  private loadedApplication: any = null
  private shutdown: () => Promise<void> = async () => void 0
  private hooks: TestRunnerConfig["hooks"] = {}
  private databaseTemplateReady = false
  private skipNextRestore = false

  constructor(config: TestRunnerConfig) {
    const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
    const moduleName = config.moduleName ?? ulid()
    this.dbName =
      config.dbName ??
      `medusa-${moduleName.toLowerCase()}-integration-${tempName}`
    this.dbTemplateName = `${this.dbName}-template`
    this.schema = config.schema ?? "public"
    this.cwd = config.cwd ?? config.medusaConfigFile ?? process.cwd()
    this.modulesConfigPath = config.medusaConfigFile ?? this.cwd
    this.env = config.env ?? {}
    this.debug = config.debug ?? false
    this.inApp = config.inApp ?? false

    this.dbUtils = dbTestUtilFactory()
    this.dbConfig = {
      dbName: this.dbName,
      clientUrl: getDatabaseURL(this.dbName),
      schema: this.schema,
      debug: this.debug,
    }
    this.hooks = config.hooks ?? {}

    this.setupProcessHandlers()
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

  private createApiProxy(): any {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return this.apiUtils?.[prop]
        },
      }
    )
  }

  private createDbConnectionProxy(): any {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return this.dbUtils.pgConnection_?.[prop]
        },
      }
    )
  }

  private async initializeDatabase(): Promise<void> {
    try {
      logger.info(`Creating database ${this.dbName}`)
      await this.dbUtils.create(this.dbName)
      this.dbUtils.pgConnection_ = await initDb()
    } catch (error) {
      logger.error(`Error initializing database: ${error?.message}`)
      await this.cleanup()
      throw error
    }
  }

  private async setupApplication(): Promise<void> {
    const { container, MedusaAppLoader } = await import("@medusajs/framework")
    const appLoader = new MedusaAppLoader({
      medusaConfigPath: this.modulesConfigPath,
      cwd: this.cwd,
    })

    // Load plugins modules
    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )
    const plugins = await getResolvedPlugins(this.cwd, configModule)
    mergePluginModules(configModule, plugins)

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
    })

    if (this.hooks?.beforeServerStart) {
      await this.hooks.beforeServerStart(container)
    }

    await this.initializeDatabase()

    const migrator = new Migrator({ container })
    await migrator.ensureMigrationsTable()

    logger.info(
      `Migrating database with core migrations and links ${this.dbName}`
    )
    await migrateDatabase(appLoader)
    await syncLinks(appLoader, this.modulesConfigPath, container, logger)
    await clearInstances()

    this.loadedApplication = await appLoader.load()

    try {
      const {
        shutdown,
        container: appContainer,
        port,
      } = await startApp({
        cwd: this.modulesConfigPath,
        env: this.env,
      })

      this.globalContainer = appContainer
      this.shutdown = async () => {
        await shutdown()
        if (this.apiUtils?.cancelToken?.source) {
          this.apiUtils.cancelToken.source.cancel(
            "Request canceled by shutdown"
          )
        }
      }

      const { default: axios } = (await import("axios")) as any
      const cancelTokenSource = axios.CancelToken.source()

      this.apiUtils = axios.create({
        baseURL: `http://localhost:${port}`,
        cancelToken: cancelTokenSource.token,
      })

      this.apiUtils.cancelToken = { source: cancelTokenSource }

      await waitWorkflowExecutions(this.globalContainer as MedusaContainer)
    } catch (error) {
      logger.error(`Error starting the app: ${error?.message}`)
      await this.cleanup()
      throw error
    }
  }

  public async cleanup(): Promise<void> {
    try {
      process.removeAllListeners("SIGTERM")
      process.removeAllListeners("SIGINT")

      await this.shutdown()
      await clearInstances()

      if (this.apiUtils?.cancelToken?.source) {
        this.apiUtils.cancelToken.source.cancel("Cleanup")
      }

      if (this.globalContainer?.dispose) {
        await this.globalContainer.dispose()
      }

      if (this.databaseTemplateReady) {
        await this.dbUtils.dropTemplate(this.dbTemplateName)
      }

      await this.dbUtils.shutdown(this.dbName)
      await closeWaitingroomClient()

      this.databaseTemplateReady = false
      this.skipNextRestore = false
      this.apiUtils = null
      this.loadedApplication = null
      this.globalContainer = null

      if (global.gc) {
        global.gc()
      }
    } catch (error) {
      logger.error("Error during cleanup:", error?.message)
    }
  }

  public async beforeAll(): Promise<void> {
    try {
      this.setupProcessHandlers()
      await configLoaderOverride(this.cwd, this.dbConfig)
      applyEnvVarsToProcess(this.env)
      await this.setupApplication()
    } catch (error) {
      await this.cleanup()
      throw error
    }
  }

  private async snapshotDatabase(): Promise<void> {
    await this.dbUtils.snapshot({
      databaseName: this.dbName,
      templateName: this.dbTemplateName,
    })
    this.databaseTemplateReady = true
  }

  public async beforeEach(): Promise<void> {
    try {
      if (!this.databaseTemplateReady) {
        // Snapshot after the suite's own beforeAll hooks so custom schema changes
        // (for example ad-hoc link tables) are included in the restore template.
        await this.snapshotDatabase()
        return
      }

      if (this.skipNextRestore) {
        this.skipNextRestore = false
        return
      }

      await this.dbUtils.restore({
        databaseName: this.dbName,
        templateName: this.dbTemplateName,
      })
    } catch (error) {
      logger.error("Error restoring database:", error?.message)
      throw error
    }
  }

  public async afterEach(): Promise<void> {
    if (!this.globalContainer) {
      return
    }

    try {
      await waitWorkflowExecutions(this.globalContainer)
    } catch (error) {
      logger.error(
        `Error waiting for workflow executions to finish:\n${formatError(
          error
        )}`
      )
      throw error
    }
  }

  public getOptions(): MedusaSuiteOptions {
    return {
      api: this.createApiProxy(),
      dbConnection: this.createDbConnectionProxy(),
      getMedusaApp: () => this.loadedApplication,
      getContainer: () => this.globalContainer as MedusaContainer,
      dbConfig: {
        dbName: this.dbName,
        schema: this.schema,
        clientUrl: this.dbConfig.clientUrl,
      },
      dbUtils: {
        ...this.dbUtils,
        snapshot: async (options) => {
          await this.dbUtils.snapshot({
            databaseName: this.dbName,
            templateName: options?.templateName ?? this.dbTemplateName,
          })
          this.databaseTemplateReady = true
          this.skipNextRestore = true
        },
        restore: (options) =>
          this.dbUtils.restore({
            databaseName: this.dbName,
            templateName: options?.templateName ?? this.dbTemplateName,
          }),
      },
      utils: {
        waitWorkflowExecutions: () =>
          waitWorkflowExecutions(this.globalContainer as MedusaContainer),
      },
    }
  }
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
  hooks,
  cwd,
}: {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  medusaConfigFile?: string
  schema?: string
  debug?: boolean
  inApp?: boolean
  testSuite: (options: MedusaSuiteOptions) => void
  hooks?: TestRunnerConfig["hooks"]
  cwd?: string
}) {
  const runner = new MedusaTestRunner({
    moduleName,
    dbName,
    medusaConfigFile,
    schema,
    env,
    debug,
    inApp,
    hooks,
    cwd,
  })

  return describe("", () => {
    let testOptions: MedusaSuiteOptions

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
