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

declare global {
  function query(
    query: string | RemoteJoinerQuery,
    variables?: Record<string, unknown>
  ): Promise<any>
  var link: RemoteLink
}

export type MedusaModuleConfig = (Partial<ModuleConfig> | Modules)[]
export type SharedResources = {
  database?: ModuleServiceInitializeOptions["database"] & {
    pool?: {
      min?: number
      max?: number
      idleTimeoutMillis?: number
      idleInTransactionSessionTimeout?: number
    }
  }
}

export async function MedusaApp({
  sharedResourcesConfig,
  modulesConfigPath,
  modulesConfig,
  linkModules,
  remoteFetchData,
}: {
  sharedResourcesConfig?: SharedResources
  loadedModules?: LoadedModule[]
  modulesConfigPath?: string
  modulesConfig?: MedusaModuleConfig
  linkModules?: ModuleJoinerConfig | ModuleJoinerConfig[]
  remoteFetchData?: RemoteFetchDataCallback
} = {}): Promise<{
  modules: LoadedModule[]
  link: RemoteLink
  query: (
    query: string | RemoteJoinerQuery,
    variables?: Record<string, unknown>
  ) => Promise<any>
}> {
  const { modules }: { modules: MedusaModuleConfig } =
    modulesConfig ??
    (await import(process.cwd() + (modulesConfigPath ?? "/modules-config")))

  const injectedDependencies: any = {}

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "medusa",
    sharedResourcesConfig as ModuleServiceInitializeOptions
  )!
  const { pool } = sharedResourcesConfig?.database ?? {}

  const { knex } = await import("@mikro-orm/knex")
  const dbConnection = knex({
    client: "pg",
    searchPath: dbData.schema || "public",
    connection: {
      connectionString: dbData.clientUrl,
      ssl: (dbData.driverOptions?.connection as any).ssl! ?? false,
      idle_in_transaction_session_timeout:
        pool?.idleInTransactionSessionTimeout ?? undefined,
    },
    pool: {
      min: pool?.min ?? 0,
      max: pool?.max,
      idleTimeoutMillis: pool?.idleTimeoutMillis ?? undefined,
    },
  })

  injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] = dbConnection

  const allModules: LoadedModule[] = []

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

      const loaded = await MedusaModule.bootstrap(
        key,
        path,
        declaration,
        undefined,
        injectedDependencies,
        isObject(mod) ? mod.definition : undefined
      )
      allModules[key] = loaded[key]

      return loaded
    })
  )

  try {
    const { initialize: initializeLinks } = await import(
      "@medusajs/link-modules" as string
    )
    await initializeLinks({}, linkModules, injectedDependencies)

    global.link = new RemoteLink()
  } catch (err) {
    console.warn("Error initializing link modules.")
  }

  const remoteQuery = new RemoteQuery(undefined, remoteFetchData)
  global.query = async (
    query: string | RemoteJoinerQuery,
    variables?: Record<string, unknown>
  ) => {
    return await remoteQuery.query(query, variables)
  }

  return {
    modules: allModules,
    link: global.link,
    query: global.query,
  }
}
