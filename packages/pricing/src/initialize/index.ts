import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IPricingModuleService, ModulesSdkTypes } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "../types"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IPricingModuleService> => {
  const serviceKey = Modules.PRICING

  const loaded = await MedusaModule.bootstrap<IPricingModuleService>(
    serviceKey,
    MODULE_PACKAGE_NAMES[Modules.PRICING],
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey]
}
