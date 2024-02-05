import { moduleDefinition } from "./module-definition"
import {
  ExternalModuleDeclaration,
  IFulfillmentModuleService,
  InternalModuleDeclaration,
  ModulesSdkTypes,
} from "@medusajs/types"
import { InitializeModuleInjectableDependencies } from "@types"
import {
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"

export * from "./types"
export * from "./models"
export * from "./services"

export async function initialize(
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<IFulfillmentModuleService> {
  const serviceKey = Modules.FULFILLMENT

  const loaded = await MedusaModule.bootstrap<IFulfillmentModuleService>({
    moduleKey: serviceKey,
    defaultPath: MODULE_PACKAGE_NAMES[serviceKey],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[serviceKey]
}

export const runMigrations = moduleDefinition.runMigrations
export const revertMigration = moduleDefinition.revertMigration
export default moduleDefinition
