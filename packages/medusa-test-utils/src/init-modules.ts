import { knex } from "knex"
import {
  MedusaApp,
  MedusaModule,
  MedusaModuleConfig,
  ModuleJoinerConfig,
} from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"

interface InitModulesOptions {
  injectedDependencies?: Record<string, unknown>
  databaseConfig: {
    clientUrl: string
    schema?: string
  }
  modulesConfig: MedusaModuleConfig
  joinerConfig?: ModuleJoinerConfig[]
}

export async function initModules({
  injectedDependencies,
  databaseConfig,
  modulesConfig,
  joinerConfig,
}: InitModulesOptions) {
  injectedDependencies ??= {}

  let sharedPgConnection =
    injectedDependencies?.[ContainerRegistrationKeys.PG_CONNECTION]

  if (!sharedPgConnection) {
    sharedPgConnection = knex<any, any>({
      client: "pg",
      searchPath: databaseConfig.schema,
      connection: {
        connectionString: databaseConfig.clientUrl,
      },
    })

    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] =
      sharedPgConnection
  }

  const medusaApp = await MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    injectedDependencies,
  })

  async function shutdown() {
    await (sharedPgConnection as any).context?.destroy()
    MedusaModule.clearInstances()
  }

  return {
    medusaApp,
    shutdown,
  }
}
