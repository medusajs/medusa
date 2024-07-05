import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { ICartModuleService, ModulesSdkTypes } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "@types"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<ICartModuleService> => {
  const loaded = await MedusaModule.bootstrap<ICartModuleService>({
    moduleKey: Modules.CART,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.CART],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[Modules.CART]
}
