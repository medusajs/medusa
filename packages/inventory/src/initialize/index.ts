import { IInventoryService } from "@medusajs/medusa"
import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule
} from "@medusajs/modules-sdk"
import { EventBusTypes } from "@medusajs/types"
import { InventoryServiceInitializeOptions } from "../types"

export const initialize = async (
  options?: InventoryServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: EventBusTypes.IEventBusService
  }
): Promise<IInventoryService> => {
  const serviceKey = "inventoryService"
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/inventory",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    injectedDependencies
  )

  return loaded[serviceKey] as IInventoryService
}
