import { RemoteFetchDataCallback } from "@medusajs/orchestration"
import {
  LoadedModule,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleConfig,
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

export type MedusaModuleConfig = (Partial<ModuleConfig> | Modules)[]
export type SharedResources = {
  database?: ModuleServiceInitializeOptions["database"] & {
    pool?: {
      name?: string
      afterCreate?: Function
      min?: number
      max?: number
      refreshIdle?: boolean
      idleTimeoutMillis?: number
      reapIntervalMillis?: number
      returnToHead?: boolean
      priorityRange?: number
      log?: (message: string, logLevel: string) => void
    }
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
  const { pool } = sharedResourcesConfig?.database ?? {}

  if (dbData?.clientUrl) {
    const { knex } = await import("knex")
    const dbConnection = knex({
      client: "pg",
      searchPath: dbData.schema || "public",
      connection: {
        connectionString: dbData.clientUrl,
        ssl: (dbData.driverOptions?.connection as any).ssl! ?? false,
      },
      pool: {
        // https://knexjs.org/guide/#pool
        ...(pool ?? {}),
        min: pool?.min ?? 0,
      },
    })

    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] = dbConnection
  }

  const allModules: Record<string, LoadedModule | LoadedModule[]> = {}

  await Promise.all(
    modules.map(async (mod: Partial<ModuleConfig> | Modules) => {
      let key: Modules | string = mod as Modules
      let path: string
      let declaration: any = {}

      if (isObject(mod)) {
        if (!mod.module) {
          throw new Error(
            `Module ${JSON.stringify(mod)} is missing module name.`
          )
        }

        key = mod.module
        path = mod.path ?? MODULE_PACKAGE_NAMES[key]

        declaration = { ...mod }
        delete declaration.definition
      } else {
        path = MODULE_PACKAGE_NAMES[mod as Modules]
      }

      if (!path) {
        throw new Error(`Module ${key} is missing path.`)
      }

      declaration.scope ??= MODULE_SCOPE.INTERNAL

      if (
        declaration.scope === MODULE_SCOPE.INTERNAL &&
        !declaration.resources
      ) {
        declaration.resources = MODULE_RESOURCE_TYPE.SHARED
      }

      const loaded = (await MedusaModule.bootstrap(
        key,
        path,
        declaration,
        undefined,
        injectedDependencies,
        isObject(mod) ? mod.definition : undefined
      )) as LoadedModule

      if (allModules[key] && !Array.isArray(allModules[key])) {
        allModules[key] = []
      }

      if (allModules[key]) {
        ;(allModules[key] as LoadedModule[]).push(loaded[key])
      } else {
        allModules[key] = loaded[key]
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
