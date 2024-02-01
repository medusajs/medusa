import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IInventoryService } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { InventoryServiceInitializeOptions } from "../types"

export const initialize = async (
  options: InventoryServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IInventoryService> => {
  const serviceKey = Modules.INVENTORY
  const loaded = await MedusaModule.bootstrap<IInventoryService>({
    moduleKey: serviceKey,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.INVENTORY],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[serviceKey]
}
