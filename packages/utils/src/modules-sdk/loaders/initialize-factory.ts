import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  ModuleExports,
} from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"

/**
 * Generate a initialize module factory that is exported by the module to be initialized manually
 *
 * @param moduleName
 * @param moduleDefinition
 */
export function initializeFactory<T>({
  moduleName,
  moduleDefinition,
}: {
  moduleName: string
  moduleDefinition: ModuleExports
}) {
  return async (
    options?:
      | ModulesSdkTypes.ModuleServiceInitializeOptions
      | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
      | ExternalModuleDeclaration
      | InternalModuleDeclaration,
    injectedDependencies?: any
  ) => {
    const loaded = await MedusaModule.bootstrap<T>({
      moduleKey: moduleName,
      defaultPath: MODULE_PACKAGE_NAMES[moduleName],
      declaration: options as
        | InternalModuleDeclaration
        | ExternalModuleDeclaration,
      injectedDependencies,
      moduleExports: moduleDefinition,
    })

    return loaded[moduleName] as T
  }
}
