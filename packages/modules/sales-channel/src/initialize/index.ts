import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { ModulesSdkTypes, ISalesChannelModuleService } from "@medusajs/types"
import { InitializeModuleInjectableDependencies } from "@types"

import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<ISalesChannelModuleService> => {
  const serviceKey = Modules.SALES_CHANNEL

  const loaded = await MedusaModule.bootstrap<ISalesChannelModuleService>({
    moduleKey: serviceKey,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.SALES_CHANNEL],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[serviceKey]
}
