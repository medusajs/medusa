import {
  MedusaApp,
  MedusaModule,
  MedusaModuleConfig,
  ModuleJoinerConfig,
} from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"

export interface InitModulesOptions {
  injectedDependencies?: Record<string, unknown>
  databaseConfig: {
    clientUrl: string
    schema?: string
  }
  modulesConfig: MedusaModuleConfig
  joinerConfig?: ModuleJoinerConfig[]
  preventConnectionDestroyWarning?: boolean
}

export async function initModules({
  injectedDependencies,
  databaseConfig,
  modulesConfig,
  joinerConfig,
  preventConnectionDestroyWarning = false,
}: InitModulesOptions) {
  injectedDependencies ??= {}

  let sharedPgConnection =
    injectedDependencies?.[ContainerRegistrationKeys.PG_CONNECTION]

  let shouldDestroyConnectionAutomatically = !sharedPgConnection
  if (!sharedPgConnection) {
    sharedPgConnection = ModulesSdkUtils.createPgConnection({
      clientUrl: databaseConfig.clientUrl,
      schema: databaseConfig.schema,
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
    if (shouldDestroyConnectionAutomatically) {
      await (sharedPgConnection as any).context?.destroy()
      await (sharedPgConnection as any).destroy()
    } else {
      if (!preventConnectionDestroyWarning) {
        console.info(
          `You are using a custom shared connection. The connection won't be destroyed automatically.`
        )
      }
    }
    MedusaModule.clearInstances()
  }

  return {
    medusaApp,
    shutdown,
  }
}
