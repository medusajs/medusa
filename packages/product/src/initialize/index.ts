import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IProductService } from "@medusajs/types"

import { ProductServiceInitializeOptions } from "../types"

export const initialize = async (
  options: ProductServiceInitializeOptions | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService: IEventBusService
  }
): Promise<IProductService> => {
  const serviceKey = Modules.INVENTORY
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/product",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    injectedDependencies
  )

  return loaded[serviceKey] as IProductService
}
