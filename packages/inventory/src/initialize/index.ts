import { MedusaModule, ModulesSdkTypes } from "@medusajs/modules-sdk"
import { IEventBusService, IInventoryService } from "@medusajs/types"
import { InventoryServiceInitializeOptions } from "../types"

export const initialize = async (
  options?:
    | InventoryServiceInitializeOptions
    | ModulesSdkTypes.ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IInventoryService> => {
  const serviceKey = "inventoryService"
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/inventory",
    options as
      | ModulesSdkTypes.InternalModuleDeclaration
      | ModulesSdkTypes.ExternalModuleDeclaration,
    injectedDependencies
  )

  return loaded[serviceKey] as IInventoryService
}
