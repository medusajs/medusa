import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService, IProductService } from "@medusajs/types"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { GatewayService } from "@services"
import loadContainer from "../loaders/container"
import loadConnection from "../loaders/connection"
import * as ProductModels from "@models"

const service = GatewayService
const loaders = [loadContainer, loadConnection] as any
const models = Object.values(ProductModels)

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
    {
      service,
      loaders,
      models,
    },
    injectedDependencies
  )

  return loaded[serviceKey] as IProductService
}
