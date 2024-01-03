import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IAuthenticationModuleService, ModulesSdkTypes } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "../types"

export const initialize = async (
  options?: ModulesSdkTypes.ModuleBootstrapDeclaration,
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
