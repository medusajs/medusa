import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IStockLocationService } from "@medusajs/types"
import { StockLocationServiceInitializeOptions } from "../types"
import { moduleDefinition } from "../module-definition"

export const initialize = async (
  options: StockLocationServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IStockLocationService> => {
  const serviceKey = Modules.STOCK_LOCATION
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/stock-location",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey] as IStockLocationService
}
