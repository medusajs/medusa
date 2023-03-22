import { MedusaModule, ModulesSdkTypes } from "@medusajs/modules-sdk"
import { IEventBusService, IStockLocationService } from "@medusajs/types"
import { StockLocationServiceInitializeOptions } from "../types"

export const initialize = async (
  options?:
    | StockLocationServiceInitializeOptions
    | ModulesSdkTypes.ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IStockLocationService> => {
  const serviceKey = "stockLocationService"
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/stock-location",
    options as
      | ModulesSdkTypes.InternalModuleDeclaration
      | ModulesSdkTypes.ExternalModuleDeclaration,
    injectedDependencies
  )

  return loaded[serviceKey] as IStockLocationService
}
