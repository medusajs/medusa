import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
} from "@medusajs/modules-sdk"
import { IEventBusService, IStockLocationService } from "@medusajs/types"
import { StockLocationServiceInitializeOptions } from "../types"

export const initialize = async (
  options?: StockLocationServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IStockLocationService> => {
  const serviceKey = "stockLocationService"
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/stock-location",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    injectedDependencies
  )

  return loaded[serviceKey] as IStockLocationService
}
