import {
  LoadedModule,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleConfig,
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
  function query(query: string): Promise<any>
  var link: RemoteLink
}

export type MedusaModuleConfig = (Partial<ModuleConfig> | Modules)[]

export async function MedusaApp({
  sharedResourcesConfig,
  loadedModules,
}: {
  sharedResourcesConfig?: any
  loadedModules?: LoadedModule[]
} = {}) {
  const { modules }: { modules: MedusaModuleConfig } = await import(
    process.cwd() + "/modules-config"
  )

  const injectedDependencies: any = {}

  if (sharedResourcesConfig?.database) {
    const { knex } = await import("@mikro-orm/knex")
    const { database } = sharedResourcesConfig

    const dbData =
      database?.clientUrl ??
      ModulesSdkUtils.loadDatabaseConfig("medusa", database)!

    const { driverOptions: extra } = database

    const dbConnection = knex({
      client: "pg",
      searchPath: dbData.schema,
      connection: {
        connectionString: dbData.clientUrl,
        ssl: (dbData.driverOptions?.connection as any).ssl! ?? false,
        idle_in_transaction_session_timeout:
          extra?.idle_in_transaction_session_timeout ?? undefined,
      },
      pool: {
        min: 0,
        max: extra?.max,
        idleTimeoutMillis: extra?.idleTimeoutMillis ?? undefined,
      },
    })

    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] = dbConnection
  }

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
        injectedDependencies
        //isObject(mod) ? mod.definition : undefined
      )
      allModules[key] = loaded[key]

      return loaded
    })
  )

  try {
    const { initialize: initializeLinks } = await import(
      "@medusajs/link-modules" as string
    )
    await initializeLinks()

    global.link = new RemoteLink()
  } catch (err) {
    console.warn("Error initializing link modules.")
  }

  const remoteQuery = new RemoteQuery()
  global.query = async (query: string) => {
    return await remoteQuery.query(query)
  }

  return {
    modules: allModules,
    link: global.link,
    query: global.query,
  }
}
