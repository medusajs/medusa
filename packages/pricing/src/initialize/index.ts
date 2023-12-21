import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IPricingModuleService, ModulesSdkTypes } from "@medusajs/types"

import { InitializeModuleInjectableDependencies } from "@types"
import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IPricingModuleService> => {
  const serviceKey = Modules.PRICING

  const loaded = await MedusaModule.bootstrap<IPricingModuleService>({
    moduleKey: serviceKey,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.PRICING],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[serviceKey]
}
