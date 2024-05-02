import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IAuthModuleService, ModulesSdkTypes } from "@medusajs/types"

import { InitializeModuleInjectableDependencies } from "@types"
import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleBootstrapDeclaration
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IAuthModuleService> => {
  const loaded = await MedusaModule.bootstrap<IAuthModuleService>({
    moduleKey: Modules.AUTH,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.AUTH],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration, // TODO: Add provider configuration
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[Modules.AUTH]
}
