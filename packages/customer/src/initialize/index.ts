import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { ICustomerModuleService, ModulesSdkTypes } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "@types"

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<ICustomerModuleService> => {
  const loaded = await MedusaModule.bootstrap<ICustomerModuleService>({
    moduleKey: Modules.CUSTOMER,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.CUSTOMER],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[Modules.CUSTOMER]
}
