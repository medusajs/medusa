import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IProductModuleService, ModulesSdkTypes } from "@medusajs/types"

import { InitializeModuleInjectableDependencies } from "../types"
import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IProductModuleService> => {
  const serviceKey = Modules.PRODUCT

  const loaded = await MedusaModule.bootstrap<IProductModuleService>(
    serviceKey,
    MODULE_PACKAGE_NAMES[Modules.PRODUCT],
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey]
}
