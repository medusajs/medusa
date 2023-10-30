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
import IsolateProductDomainFeatureFlag from "./feature-flags/isolate-product-domain"
import IsolatePricingDomainFeatureFlag from "./feature-flags/isolate-pricing-domain"
import { featureFlagRouter } from "./feature-flags"

export const loadMedusaApp = async (
  {
    configModule,
    container,
  }: { configModule: CommonTypes.ConfigModule; container: MedusaContainer },
  config = { registerInContainer: true }
): Promise<MedusaAppOutput> => {
  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
  }

  const sharedResourcesConfig = {
    database: {
      clientUrl: configModule.projectConfig.database_url,
      driverOptions: configModule.projectConfig.database_extra,
    },
  }

  container.register(ContainerRegistrationKeys.REMOTE_QUERY, asValue(undefined))
  container.register(ContainerRegistrationKeys.REMOTE_LINK, asValue(undefined))

  let configModules = { ...configModule.modules } ?? {}

  if (
    featureFlagRouter.isFeatureEnabled(IsolateProductDomainFeatureFlag.key) ||
    featureFlagRouter.isFeatureEnabled(IsolatePricingDomainFeatureFlag.key)
  ) {
    configModules = mergeModulesConfig(configModules ?? {}, modulesConfig)
  }

  const medusaApp = await MedusaApp({
    modulesConfig: configModules,
    servicesConfig: joinerConfig,
    remoteFetchData: remoteQueryFetchData(container),
    sharedContainer: container,
    sharedResourcesConfig,
    injectedDependencies,
  })

  if (!config.registerInContainer) {
    return medusaApp
  }

  container.register("remoteLink", asValue(medusaApp.link))
  container.register(
    ContainerRegistrationKeys.REMOTE_QUERY,
    asValue(medusaApp.query)
  )

  for (const [serviceKey, moduleService] of Object.entries(medusaApp.modules)) {
    container.register(
      ModulesDefinition[serviceKey].registrationName,
      asValue(moduleService)
    )
  }

  return medusaApp
}

export default loadMedusaApp
