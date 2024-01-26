import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IAuthenticationModuleService, ModulesSdkTypes } from "@medusajs/types"

import { InitializeModuleInjectableDependencies } from "../types"
import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleBootstrapDeclaration
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IAuthenticationModuleService> => {
  const loaded = await MedusaModule.bootstrap<IAuthenticationModuleService>({
    moduleKey: Modules.AUTHENTICATION,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.AUTHENTICATION],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration, // TODO: Add provider configuration
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[Modules.AUTHENTICATION]
}
