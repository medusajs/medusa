import { RemoteFetchDataCallback } from "@medusajs/orchestration"
import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  LoadedModule,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleJoinerConfig,
  ModuleServiceInitializeOptions,
  RemoteJoinerQuery,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModulesSdkUtils,
  isObject,
} from "@medusajs/utils"
import { MODULE_PACKAGE_NAMES, Modules } from "./definitions"
import { MedusaModule } from "./medusa-module"
import { RemoteLink } from "./remote-link"
import { RemoteQuery } from "./remote-query"

export type MedusaModuleConfig = {
  [key: string | Modules]:
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
    | true
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

export async function MedusaApp({
  sharedResourcesConfig,
  servicesConfig,
  modulesConfigPath,
  modulesConfigFileName,
  modulesConfig,
  linkModules,
  remoteFetchData,
  injectedDependencies = {},
}: {
  sharedResourcesConfig?: SharedResources
  loadedModules?: LoadedModule[]
  servicesConfig?: ModuleJoinerConfig[]
  modulesConfigPath?: string
  modulesConfigFileName?: string
  modulesConfig?: MedusaModuleConfig
  linkModules?: ModuleJoinerConfig | ModuleJoinerConfig[]
  remoteFetchData?: RemoteFetchDataCallback
  injectedDependencies?: any
}): Promise<{
  modules: Record<string, LoadedModule | LoadedModule[]>
  link: RemoteLink | undefined
  query: (
    query: string | RemoteJoinerQuery,
    variables?: Record<string, unknown>
  ) => Promise<any>
}> {
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

  const allModules: Record<string, LoadedModule | LoadedModule[]> = {}

  await Promise.all(
    Object.keys(modules).map(async (moduleName) => {
      const mod = modules[moduleName] as MedusaModuleConfig

      let path: string
      let declaration: any = {}

      if (isObject(mod)) {
        const mod_ = mod as unknown as InternalModuleDeclaration
        path = mod_.resolve ?? MODULE_PACKAGE_NAMES[moduleName]

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

      const loaded = (await MedusaModule.bootstrap(
        moduleName,
        path,
        declaration,
        undefined,
        injectedDependencies,
        (isObject(mod) ? mod.definition : undefined) as ModuleDefinition
      )) as LoadedModule

      if (allModules[moduleName] && !Array.isArray(allModules[moduleName])) {
        allModules[moduleName] = []
      }

      if (allModules[moduleName]) {
        ;(allModules[moduleName] as LoadedModule[]).push(loaded[moduleName])
      } else {
        allModules[moduleName] = loaded[moduleName]
      }

      return loaded
    })
  )

  let link: RemoteLink | undefined = undefined
  let query: (
    query: string | RemoteJoinerQuery,
    variables?: Record<string, unknown>
  ) => Promise<any>

  try {
    const { initialize: initializeLinks } = await import(
      "@medusajs/link-modules" as string
    )
    await initializeLinks({}, linkModules, injectedDependencies)

    link = new RemoteLink()
  } catch (err) {
    console.warn("Error initializing link modules.", err)
  }

  const remoteQuery = new RemoteQuery({
    servicesConfig,
    customRemoteFetchData: remoteFetchData,
  })
  query = async (
    query: string | RemoteJoinerQuery,
    variables?: Record<string, unknown>
  ) => {
    return await remoteQuery.query(query, variables)
  }

  return {
    modules: allModules,
    link,
    query,
  }
}
