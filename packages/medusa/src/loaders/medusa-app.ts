import { CommonTypes, MedusaContainer } from "@medusajs/types"
import {
  MedusaApp,
  MedusaAppOutput,
  ModulesDefinition,
} from "@medusajs/modules-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"
import { asValue } from "awilix"
import { joinerConfig } from "../joiner-config"
import { mergeModulesConfig } from "../utils/merge-modules-config"
import modulesConfig from "../modules-config"
import { remoteQueryFetchData } from ".."

export const loadMedusaApp = async (
  {
    configModule,
    container,
  }: { configModule: CommonTypes.ConfigModule; container: MedusaContainer },
  config = { registerInContainer: true }
): Promise<MedusaAppOutput> => {
  mergeModulesConfig(configModule.modules ?? {}, modulesConfig)

  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
  }

  const sharedResourcesConfig = {
    database: {
      clientUrl: configModule.projectConfig.database_url,
    },
  }

  const medusaApp = await MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    remoteFetchData: remoteQueryFetchData(container),
    sharedResourcesConfig,
    injectedDependencies,
  })

  if (!config.registerInContainer) {
    return medusaApp
  }

  container.register("remoteLink", asValue(medusaApp.link))

  const { query, modules } = medusaApp

  // Medusa app load all non legacy modules, so we need to register them in the container since they are into their own container
  // We might decide to do it elsewhere but for now I think it is fine
  for (const [serviceKey, moduleService] of Object.entries(modules)) {
    container.register(
      ModulesDefinition[serviceKey].registrationName,
      asValue(moduleService)
    )
  }
  container.register("remoteQuery", asValue(query))

  return medusaApp
}

export default loadMedusaApp
