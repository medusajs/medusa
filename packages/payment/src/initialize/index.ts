import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import {
  IPaymentModuleService,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/types"

import { moduleDefinition } from "../module-definition"
import { InitializeModuleInjectableDependencies } from "../types"

export const initialize = async (
  options?:
    | (
        | ModulesSdkTypes.ModuleServiceInitializeOptions
        | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
        | ExternalModuleDeclaration
        | InternalModuleDeclaration
      ) & { providers: ModuleProvider[] },
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IPaymentModuleService> => {
  const loaded = await MedusaModule.bootstrap<IPaymentModuleService>({
    moduleKey: Modules.PAYMENT,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.PAYMENT],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[Modules.PAYMENT]
}
