import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  LoadedModule,
  LoaderOptions,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleJoinerConfig,
  ModuleServiceInitializeOptions,
  RemoteJoinerQuery,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  isObject,
  ModulesSdkUtils,
} from "@medusajs/utils"
import {
  MODULE_PACKAGE_NAMES,
  ModuleRegistrationName,
  Modules,
} from "./definitions"
import { MedusaModule } from "./medusa-module"
import { RemoteFetchDataCallback } from "@medusajs/orchestration"
import { RemoteLink } from "./remote-link"
import { RemoteQuery } from "./remote-query"
import { cleanGraphQLSchema } from "./utils"
import { asValue } from "awilix"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { mergeTypeDefs } from "@graphql-tools/merge"

const LinkModulePackage = "@medusajs/link-modules"

export type RunMigrationFn = (
  options?: ModuleServiceInitializeOptions,
  injectedDependencies?: Record<any, any>
) => Promise<void>

export type MedusaModuleConfig = {
  [key: string | Modules]:
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

async function loadModules(modulesConfig, sharedContainer) {
  const allModules = {}

  await Promise.all(
    Object.keys(modulesConfig).map(async (moduleName) => {
      const mod = modulesConfig[moduleName]
      let path: string
      let declaration: any = {}
      let definition: ModuleDefinition | undefined = undefined

      if (isObject(mod)) {
        const mod_ = mod as unknown as InternalModuleDeclaration
        path = mod_.resolve ?? MODULE_PACKAGE_NAMES[moduleName]
        definition = mod_.definition
        declaration = { ...mod }
        delete declaration.definition
      } else {
        path = MODULE_PACKAGE_NAMES[moduleName]
      }

      declaration.scope ??= MODULE_SCOPE.INTERNAL
      if (
        declaration.scope === MODULE_SCOPE.INTERNAL &&
        !declaration.resources
      ) {
        declaration.resources = MODULE_RESOURCE_TYPE.SHARED
      }

      const loaded = (await MedusaModule.bootstrap({
        moduleKey: moduleName,
        defaultPath: path,
        declaration,
        sharedContainer,
        moduleDefinition: definition,
      })) as LoadedModule

      const service = loaded[moduleName]
      sharedContainer.register({
        [service.__definition.registrationName]: asValue(service),
      })

      if (allModules[moduleName] && !Array.isArray(allModules[moduleName])) {
        allModules[moduleName] = []
      }

      if (allModules[moduleName]) {
        ;(allModules[moduleName] as LoadedModule[]).push(loaded[moduleName])
      } else {
        allModules[moduleName] = loaded[moduleName]
      }
    })
  )
  return allModules
}

async function initializeLinks(config, linkModules, injectedDependencies) {
  try {
    const { initialize, runMigrations } = await import(LinkModulePackage)
    const linkResolution = await initialize(
      config,
      linkModules,
      injectedDependencies
    )

    return { remoteLink: new RemoteLink(), linkResolution, runMigrations }
  } catch (err) {
    console.warn("Error initializing link modules.", err)

    return {
      remoteLink: undefined,
      linkResolution: undefined,
      runMigrations: undefined,
    }
  }
}

function cleanAndMergeSchema(loadedSchema) {
  const { schema: cleanedSchema, notFound } = cleanGraphQLSchema(loadedSchema)
  const mergedSchema = mergeTypeDefs(cleanedSchema)
  return { schema: makeExecutableSchema({ typeDefs: mergedSchema }), notFound }
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
  query: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
  entitiesMap?: Record<string, any>
  notFound?: Record<string, Record<string, string>>
  runMigrations: RunMigrationFn
}

export async function MedusaApp(
  {
    sharedContainer,
    sharedResourcesConfig,
    servicesConfig,
    modulesConfigPath,
    modulesConfigFileName,
    modulesConfig,
    linkModules,
    remoteFetchData,
    injectedDependencies,
  }: {
    sharedContainer?: MedusaContainer
    sharedResourcesConfig?: SharedResources
    loadedModules?: LoadedModule[]
    servicesConfig?: ModuleJoinerConfig[]
    modulesConfigPath?: string
    modulesConfigFileName?: string
    modulesConfig?: MedusaModuleConfig
    linkModules?: ModuleJoinerConfig | ModuleJoinerConfig[]
    remoteFetchData?: RemoteFetchDataCallback
    injectedDependencies?: any
  } = {
    injectedDependencies: {},
  }
): Promise<{
  modules: Record<string, LoadedModule | LoadedModule[]>
  link: RemoteLink | undefined
  query: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
  entitiesMap?: Record<string, any>
  notFound?: Record<string, Record<string, string>>
  runMigrations: RunMigrationFn
}> {
  const sharedContainer_ = createMedusaContainer({}, sharedContainer)

  const modules: MedusaModuleConfig =
    modulesConfig ??
    (
      await import(
        modulesConfigPath ??
          process.cwd() + (modulesConfigFileName ?? "/modules-config")
      )
    ).default

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "medusa",
    sharedResourcesConfig as ModuleServiceInitializeOptions,
    true
  )!

  registerCustomJoinerConfigs(servicesConfig ?? [])

  if (
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
  const linkModule = modules[LinkModulePackage]
  delete modules[LinkModulePackage]
  let linkModuleOptions = {}

  if (isObject(linkModule)) {
    linkModuleOptions = linkModule
  }

  for (const injectedDependency of Object.keys(injectedDependencies)) {
    sharedContainer_.register({
      [injectedDependency]: asValue(injectedDependencies[injectedDependency]),
    })
  }

  const allModules = await loadModules(modules, sharedContainer_)

  // Share Event bus with link modules
  injectedDependencies[ModuleRegistrationName.EVENT_BUS] =
    sharedContainer_.resolve(ModuleRegistrationName.EVENT_BUS, {
      allowUnregistered: true,
    })

  const {
    remoteLink,
    linkResolution,
    runMigrations: linkModuleMigration,
  } = await initializeLinks(
    linkModuleOptions,
    linkModules,
    injectedDependencies
  )

  const loadedSchema = getLoadedSchema()
  const { schema, notFound } = cleanAndMergeSchema(loadedSchema)

  const remoteQuery = new RemoteQuery({
    servicesConfig,
    customRemoteFetchData: remoteFetchData,
  })

  const query = async (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => {
    return await remoteQuery.query(query, variables)
  }

  const runMigrations: RunMigrationFn = async (
    linkModuleOptions
  ): Promise<void> => {
    for (const moduleName of Object.keys(allModules)) {
      const moduleResolution = MedusaModule.getModuleResolutions(moduleName)

      await MedusaModule.migrateUp(
        moduleResolution.definition.key,
        moduleResolution.resolutionPath as string,
        moduleResolution.options
      )
    }

    linkModuleMigration &&
      (await linkModuleMigration({
        options: linkModuleOptions,
        injectedDependencies,
      }))
  }

  return {
    modules: allModules,
    link: remoteLink,
    query,
    entitiesMap: schema.getTypeMap(),
    notFound,
    runMigrations,
  }
}
