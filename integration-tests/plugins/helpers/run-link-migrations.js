import { MedusaApp, MedusaContainer } from "@medusajs/modules-sdk"
import {
  joinerConfig,
  mergeModulesConfig,
  modulesConfig,
  remoteQueryFetchData,
} from "@medusajs/medusa"

import { ContainerRegistrationKeys } from "@medusajs/utils"

export const runLinkMigrations = async (container, dbConfig) => {
  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
  }

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  mergeModulesConfig(configModule.modules ?? {}, modulesConfig)

  const medusaApp = await MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    remoteFetchData: remoteQueryFetchData(container),
    sharedResourcesConfig: {
      database: dbConfig,
    },
  })

  const { runMigrations } = medusaApp

  await runMigrations()
}
