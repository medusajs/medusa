import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IPromotionModuleService, ModulesSdkTypes } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "../types"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IPromotionModuleService> => {
  const loaded = await MedusaModule.bootstrap<IPromotionModuleService>({
    moduleKey: Modules.PROMOTION,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.PROMOTION],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[Modules.PROMOTION]
}
