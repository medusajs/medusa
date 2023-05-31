import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IProductService } from "@medusajs/types"
import { moduleDefinition } from "../module-definition"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"

export const initialize = async (
  options?:
    | ProductServiceInitializeOptions
    | ProductServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration,
  injectedDependencies?: {
    eventBusService?: IEventBusService
  }
): Promise<IProductService> => {
  const serviceKey = Modules.PRODUCT

  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/product",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey] as IProductService
}
