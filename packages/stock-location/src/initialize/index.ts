import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IStockLocationService } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import { StockLocationServiceInitializeOptions } from "../types"

export const initialize = async (
  options: StockLocationServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IStockLocationService> => {
  const serviceKey = Modules.STOCK_LOCATION
  const loaded = await MedusaModule.bootstrap<IStockLocationService>(
    serviceKey,
    "@medusajs/stock-location",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey]
}
