import { RemoteFetchDataCallback } from "@medusajs/orchestration"
import {
  ExternalModuleDeclaration,
  ILinkMigrationsPlanner,
  InternalModuleDeclaration,
  LoadedModule,
  MedusaContainer,
  ModuleBootstrapDeclaration,
  ModuleDefinition,
  ModuleExports,
  ModuleJoinerConfig,
  ModuleServiceInitializeOptions,
  RemoteQueryFunction,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  dynamicImport,
  GraphQLUtils,
  isObject,
  isSharedConnectionSymbol,
  isString,
  MedusaError,
  MODULE_PACKAGE_NAMES,
  Modules,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"
import { asValue } from "awilix"
import {
  MedusaModule,
  MigrationOptions,
  ModuleBootstrapOptions,
  RegisterModuleJoinerConfig,
} from "./medusa-module"
import { RemoteLink } from "./remote-link"
import { createQuery, RemoteQuery } from "./remote-query"
import { MODULE_SCOPE } from "./types"

const LinkModulePackage = MODULE_PACKAGE_NAMES[Modules.LINK]

export type RunMigrationFn = () => Promise<void>
export type RevertMigrationFn = (moduleNames: string[]) => Promise<void>
export type GenerateMigrations = (moduleNames: string[]) => Promise<void>
export type GetLinkExecutionPlanner = () => ILinkMigrationsPlanner

export type MedusaModuleConfig = {
  [key: string | Modules]:
    | string
    | boolean
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
}

export type SharedResources = {
  database?: ModuleServiceInitializeOptions["database"] & {
    /**
     * {
     *   name?: string
     *   afterCreate?: Function
     *   min?: number
     *   max?: number
     *   refreshIdle?: boolean
     *   idleTimeoutMillis?: number
     *   reapIntervalMillis?: number
     *   returnToHead?: boolean
     *   priorityRange?: number
     *   log?: (message: string, logLevel: string) => void
     * }
     */
    pool?: Record<string, unknown>
  }
}

export async function loadModules(args: {
  modulesConfig: MedusaModuleConfig
  sharedContainer: MedusaContainer
  sharedResourcesConfig?: SharedResources
  migrationOnly?: boolean
  loaderOnly?: boolean
  workerMode?: "shared" | "worker" | "server"
}) {
  const {
    modulesConfig,
    sharedContainer,
    sharedResourcesConfig,
    migrationOnly = false,
    loaderOnly = false,
    workerMode = "shared" as ModuleBootstrapOptions["workerMode"],
  } = args

  const allModules = {} as any

  const modulesToLoad: {
    moduleKey: string
    defaultPath: string
    declaration: InternalModuleDeclaration | ExternalModuleDeclaration
    sharedContainer: MedusaContainer
    moduleDefinition: ModuleDefinition
    moduleExports?: ModuleExports
  }[] = []

  for (const moduleName of Object.keys(modulesConfig)) {
    const mod = modulesConfig[moduleName]
    let path: string
    let moduleExports: ModuleExports | undefined = undefined
    let declaration: any = {}
    let definition: Partial<ModuleDefinition> | undefined = undefined

    if (mod === false) {
      continue
    }

    if (isObject(mod)) {
      const mod_ = mod as unknown as InternalModuleDeclaration
      path = mod_.resolve ?? MODULE_PACKAGE_NAMES[moduleName]
      definition = mod_.definition
      moduleExports = !isString(mod_.resolve)
        ? (mod_.resolve as ModuleExports)
        : undefined
      declaration = { ...mod }
      delete declaration.definition
    } else {
      path = MODULE_PACKAGE_NAMES[moduleName]
    }

    declaration.scope ??= MODULE_SCOPE.INTERNAL

    if (declaration.scope === MODULE_SCOPE.INTERNAL) {
      declaration.options ??= {}

      if (!declaration.options.database) {
        declaration.options[isSharedConnectionSymbol] = true
      }

      declaration.options.database ??= {
        ...sharedResourcesConfig?.database,
      }
      declaration.options.database.debug ??=
        sharedResourcesConfig?.database?.debug
    }

    modulesToLoad.push({
      moduleKey: moduleName,
      defaultPath: path,
      declaration,
      sharedContainer,
      moduleDefinition: definition as ModuleDefinition,
      moduleExports,
    })
  }

  const loaded = (await MedusaModule.bootstrapAll(modulesToLoad, {
    migrationOnly,
    loaderOnly,
    workerMode,
  })) as LoadedModule[]

  if (loaderOnly) {
    return allModules
  }

  for (const { moduleKey } of modulesToLoad) {
    const service = loaded.find((loadedModule) => loadedModule[moduleKey])?.[
      moduleKey
    ]
    if (!service) {
      throw new Error(`Module ${moduleKey} could not be loaded.`)
    }

    sharedContainer.register({
      [service.__definition.key]: asValue(service),
    })

    if (allModules[moduleKey] && !Array.isArray(allModules[moduleKey])) {
      allModules[moduleKey] = []
    }

    if (allModules[moduleKey]) {
      ;(allModules[moduleKey] as LoadedModule[]).push(service)
    } else {
      allModules[moduleKey] = service
    }
  }

  return allModules
}

async function initializeLinks({
  config,
  linkModules,
  injectedDependencies,
  moduleExports,
}) {
  try {
    let resources = moduleExports
    if (!resources) {
      const module = await dynamicImport(LinkModulePackage)
      if ("discoveryPath" in module) {
        const reExportedLoadedModule = await dynamicImport(module.discoveryPath)
        resources = reExportedLoadedModule.default ?? reExportedLoadedModule
      }
    }

    const { initialize, getMigrationPlanner } = resources

    const linkResolution = await initialize(
      config,
      linkModules,
      injectedDependencies
    )

    return {
      remoteLink: new RemoteLink(),
      linkResolution,
      getMigrationPlanner,
    }
  } catch (err) {
    console.warn("Error initializing link modules.", err)
    return {
      remoteLink: undefined,
      linkResolution: undefined,
      getMigrationPlanner: () => void 0,
    }
  }
}

function isMedusaModule(mod) {
  return typeof mod?.initialize === "function"
}

function cleanAndMergeSchema(loadedSchema) {
  const defaultMedusaSchema = `
    scalar DateTime
    scalar JSON
  `
  const { schema: cleanedSchema, notFound } = GraphQLUtils.cleanGraphQLSchema(
    defaultMedusaSchema + loadedSchema
  )
  const mergedSchema = GraphQLUtils.mergeTypeDefs(cleanedSchema)
  return {
    schema: GraphQLUtils.makeExecutableSchema({ typeDefs: mergedSchema }),
    notFound,
  }
}

function getLoadedSchema(): string {
  return MedusaModule.getAllJoinerConfigs()
    .map((joinerConfig) => joinerConfig?.schema ?? "")
    .join("\n")
}

function registerCustomJoinerConfigs(servicesConfig: ModuleJoinerConfig[]) {
  for (const config of servicesConfig) {
    if (!config.serviceName || config.isReadOnlyLink) {
      continue
    }

    MedusaModule.setJoinerConfig(config.serviceName, config)
  }
}

export type MedusaAppOutput = {
  modules: Record<string, LoadedModule | LoadedModule[]>
  link: RemoteLink | undefined
  query: RemoteQueryFunction
  entitiesMap?: Record<string, any>
  gqlSchema?: GraphQLUtils.GraphQLSchema
  notFound?: Record<string, Record<string, string>>
  runMigrations: RunMigrationFn
  revertMigrations: RevertMigrationFn
  generateMigrations: GenerateMigrations
  linkMigrationExecutionPlanner: GetLinkExecutionPlanner
  onApplicationShutdown: () => Promise<void>
  onApplicationPrepareShutdown: () => Promise<void>
  onApplicationStart: () => Promise<void>
  sharedContainer?: MedusaContainer
}

export type MedusaAppOptions = {
  workerMode?: "shared" | "worker" | "server"
  sharedContainer?: MedusaContainer
  sharedResourcesConfig?: SharedResources
  loadedModules?: LoadedModule[]
  servicesConfig?: ModuleJoinerConfig[]
  modulesConfigPath?: string
  modulesConfigFileName?: string
  modulesConfig?: MedusaModuleConfig
  linkModules?: RegisterModuleJoinerConfig | RegisterModuleJoinerConfig[]
  remoteFetchData?: RemoteFetchDataCallback
  injectedDependencies?: any
  onApplicationStartCb?: () => void
  /**
   * Forces the modules bootstrapper to only run the modules loaders and return prematurely
   */
  loaderOnly?: boolean
}

async function MedusaApp_({
  sharedContainer,
  sharedResourcesConfig,
  servicesConfig,
  modulesConfigPath,
  modulesConfigFileName,
  modulesConfig,
  linkModules,
  remoteFetchData,
  injectedDependencies = {},
  migrationOnly = false,
  loaderOnly = false,
  workerMode = "shared",
}: MedusaAppOptions & {
  migrationOnly?: boolean
} = {}): Promise<MedusaAppOutput> {
  const sharedContainer_ = createMedusaContainer({}, sharedContainer)

  const onApplicationShutdown = async () => {
    await promiseAll([
      MedusaModule.onApplicationShutdown(),
      sharedContainer_.dispose(),
    ])
  }

  const onApplicationPrepareShutdown = async () => {
    await promiseAll([MedusaModule.onApplicationPrepareShutdown()])
  }

  const onApplicationStart = async () => {
    await MedusaModule.onApplicationStart()
  }

  const modules: MedusaModuleConfig =
    modulesConfig ??
    (
      await dynamicImport(
        await (modulesConfigPath ??
          process.cwd() + (modulesConfigFileName ?? "/modules-config"))
      )
    ).default

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "medusa",
    sharedResourcesConfig as ModuleServiceInitializeOptions,
    true
  )!

  registerCustomJoinerConfigs(servicesConfig ?? [])

  if (
    sharedResourcesConfig?.database?.connection &&
    !injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION]
  ) {
    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] =
      sharedResourcesConfig.database.connection
  } else if (
    dbData.clientUrl &&
    !injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION]
  ) {
    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] =
      ModulesSdkUtils.createPgConnection({
        ...(sharedResourcesConfig?.database ?? {}),
        ...dbData,
      })
  }

  // remove the link module from the modules
  const linkModule = modules[LinkModulePackage] ?? modules[Modules.LINK]
  delete modules[LinkModulePackage]
  delete modules[Modules.LINK]

  let linkModuleOrOptions:
    | Partial<ModuleServiceInitializeOptions>
    | Partial<ModuleBootstrapDeclaration> = {}

  if (isObject(linkModule)) {
    linkModuleOrOptions = linkModule
  }

  for (const injectedDependency of Object.keys(injectedDependencies)) {
    sharedContainer_.register({
      [injectedDependency]: asValue(injectedDependencies[injectedDependency]),
    })
  }

  const allModules = await loadModules({
    modulesConfig: modules,
    sharedContainer: sharedContainer_,
    sharedResourcesConfig: { database: dbData },
    migrationOnly,
    loaderOnly,
    workerMode,
  })

  if (loaderOnly) {
    async function query(...args: any[]) {
      throw new Error("Querying not allowed in loaderOnly mode")
    }
    query.graph = query
    query.gql = query

    return {
      onApplicationShutdown,
      onApplicationPrepareShutdown,
      onApplicationStart,
      modules: allModules,
      link: undefined,
      query: query as unknown as RemoteQueryFunction,
      runMigrations: async () => {
        throw new Error("Migrations not allowed in loaderOnly mode")
      },
      revertMigrations: async () => {
        throw new Error("Revert migrations not allowed in loaderOnly mode")
      },
      generateMigrations: async () => {
        throw new Error("Generate migrations not allowed in loaderOnly mode")
      },
      linkMigrationExecutionPlanner: () => {
        throw new Error(
          "Migrations planner is not avaibable in loaderOnly mode"
        )
      },
    }
  }

  // Share Event bus with link modules
  injectedDependencies[Modules.EVENT_BUS] = sharedContainer_.resolve(
    Modules.EVENT_BUS,
    {
      allowUnregistered: true,
    }
  )

  linkModules ??= []
  if (!Array.isArray(linkModules)) {
    linkModules = [linkModules]
  }
  linkModules.push(...MedusaModule.getCustomLinks())

  const allLoadedJoinerConfigs = MedusaModule.getAllJoinerConfigs()
  for (let linkIdx = 0; linkIdx < linkModules.length; linkIdx++) {
    const customLink: any = linkModules[linkIdx]
    if (typeof customLink === "function") {
      linkModules[linkIdx] = customLink(allLoadedJoinerConfigs)
    }
  }

  const { remoteLink, getMigrationPlanner } = await initializeLinks({
    config: linkModuleOrOptions,
    linkModules,
    injectedDependencies,
    moduleExports: isMedusaModule(linkModule) ? linkModule : undefined,
  })

  const loadedSchema = getLoadedSchema()
  const { schema, notFound } = cleanAndMergeSchema(loadedSchema)
  const entitiesMap = schema.getTypeMap() as unknown as Map<string, any>

  const remoteQuery = new RemoteQuery({
    servicesConfig,
    customRemoteFetchData: remoteFetchData,
    entitiesMap,
  })

  const applyMigration = async ({
    modulesNames,
    action = "run",
  }: {
    modulesNames: string[]
    action?: "run" | "revert" | "generate"
  }) => {
    const moduleResolutions = modulesNames.map((moduleName) => {
      return {
        moduleName,
        resolution: MedusaModule.getModuleResolutions(moduleName),
      }
    })

    const missingModules = moduleResolutions
      .filter(({ resolution }) => !resolution)
      .map(({ moduleName }) => moduleName)

    if (missingModules.length) {
      const error = new MedusaError(
        MedusaError.Types.UNKNOWN_MODULES,
        `Cannot ${action} migrations for unknown module(s) ${missingModules.join(
          ","
        )}`,
        MedusaError.Codes.UNKNOWN_MODULES
      )
      error["allModules"] = Object.keys(allModules)
      throw error
    }

    for (const { resolution: moduleResolution } of moduleResolutions) {
      if (
        !moduleResolution.options?.database &&
        moduleResolution.moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL
      ) {
        moduleResolution.options ??= {}
        moduleResolution.options.database = {
          ...(sharedResourcesConfig?.database ?? {}),
        }
        ;(moduleResolution as any).options.database.debug ??=
          sharedResourcesConfig?.database?.debug
      }

      const migrationOptions: MigrationOptions = {
        moduleKey: moduleResolution.definition.key,
        modulePath: moduleResolution.resolutionPath as string,
        container: sharedContainer,
        options: moduleResolution.options,
        moduleExports: moduleResolution.moduleExports as ModuleExports,
      }

      if (action === "revert") {
        await MedusaModule.migrateDown(migrationOptions)
      } else if (action === "run") {
        await MedusaModule.migrateUp(migrationOptions)
      } else {
        await MedusaModule.migrateGenerate(migrationOptions)
      }
    }
  }

  const runMigrations: RunMigrationFn = async (): Promise<void> => {
    await applyMigration({
      modulesNames: Object.keys(allModules),
    })
  }

  const revertMigrations: RevertMigrationFn = async (
    modulesNames
  ): Promise<void> => {
    await applyMigration({
      modulesNames,
      action: "revert",
    })
  }

  const generateMigrations: GenerateMigrations = async (
    modulesNames
  ): Promise<void> => {
    await applyMigration({
      modulesNames,
      action: "generate",
    })
  }

  const getMigrationPlannerFn = () => {
    const options: Partial<ModuleServiceInitializeOptions> =
      "scope" in linkModuleOrOptions
        ? { ...linkModuleOrOptions.options }
        : {
            ...(linkModuleOrOptions as Partial<ModuleServiceInitializeOptions>),
          }

    options.database ??= {
      ...sharedResourcesConfig?.database,
    }
    options.database.debug ??= sharedResourcesConfig?.database?.debug

    return getMigrationPlanner(options, linkModules)
  }

  return {
    onApplicationShutdown,
    onApplicationPrepareShutdown,
    onApplicationStart,
    modules: allModules,
    link: remoteLink,
    query: createQuery(remoteQuery) as any, // TODO: rm any once we remove the old RemoteQueryFunction and rely on the Query object instead,
    entitiesMap,
    gqlSchema: schema,
    notFound,
    runMigrations,
    revertMigrations,
    generateMigrations,
    linkMigrationExecutionPlanner: getMigrationPlannerFn,
    sharedContainer: sharedContainer_,
  }
}

export async function MedusaApp(
  options: MedusaAppOptions = {}
): Promise<MedusaAppOutput> {
  return await MedusaApp_(options)
}

export async function MedusaAppMigrateUp(
  options: MedusaAppOptions = {}
): Promise<void> {
  const migrationOnly = true

  const { runMigrations } = await MedusaApp_({
    ...options,
    migrationOnly,
  })

  await runMigrations().finally(MedusaModule.clearInstances)
}

export async function MedusaAppMigrateDown(
  moduleNames: string[],
  options: MedusaAppOptions = {}
): Promise<void> {
  const migrationOnly = true

  const { revertMigrations } = await MedusaApp_({
    ...options,
    migrationOnly,
  })

  await revertMigrations(moduleNames).finally(MedusaModule.clearInstances)
}

export async function MedusaAppMigrateGenerate(
  moduleNames: string[],
  options: MedusaAppOptions = {}
): Promise<void> {
  const migrationOnly = true

  const { generateMigrations } = await MedusaApp_({
    ...options,
    migrationOnly,
  })

  await generateMigrations(moduleNames).finally(MedusaModule.clearInstances)
}

export async function MedusaAppGetLinksExecutionPlanner(
  options: MedusaAppOptions = {}
): Promise<ILinkMigrationsPlanner> {
  const migrationOnly = true

  const { linkMigrationExecutionPlanner } = await MedusaApp_({
    ...options,
    migrationOnly,
  })

  return linkMigrationExecutionPlanner()
}
