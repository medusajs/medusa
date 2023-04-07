import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IInventoryService } from "@medusajs/types"
import { InventoryServiceInitializeOptions } from "../types"

export const initialize = async (
  options: InventoryServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IInventoryService> => {
  const serviceKey = Modules.INVENTORY
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/inventory",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    injectedDependencies
  )

  return loaded[serviceKey] as IInventoryService
}
