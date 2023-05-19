import { IEventBusService, IProductService } from "@medusajs/types"
import * as loaders from "../loaders"

import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { createContainer } from "awilix"

export const initialize = async (
  options:
    | ProductServiceInitializeOptions
    | ProductServiceInitializeCustomDataLayerOptions,
  injectedDependencies?: {
    eventBusService?: IEventBusService
  }
): Promise<IProductService> => {
  const serviceKey = "productService" //Modules.PRODUCT

  /*const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/product",
    { options, injectedDependencies } as unknown as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies
  )*/

  const container = createContainer()

  for (const loader of Object.values(loaders) as any[]) {
    await loader({ container, options })
  }

  return container[serviceKey] as IProductService
}
