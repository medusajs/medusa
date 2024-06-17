import { StoreTypes } from "@medusajs/types"
import { IEventBusModuleService, Logger } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  eventBusModuleService?: IEventBusModuleService
}

export type UpdateStoreInput = StoreTypes.UpdateStoreDTO & { id: string }
