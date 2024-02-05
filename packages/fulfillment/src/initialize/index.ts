import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IFulfillmentModuleService, ModulesSdkTypes } from "@medusajs/types"
import { InitializeModuleInjectableDependencies } from "@types"

import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IFulfillmentModuleService> => {
  const serviceKey = Modules.SALES_CHANNEL

  const loaded = await MedusaModule.bootstrap<IFulfillmentModuleService>({
    moduleKey: serviceKey,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.FULFILLMENT],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[serviceKey]
}
