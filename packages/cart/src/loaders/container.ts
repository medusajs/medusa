import * as defaultRepositories from "@repositories"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { loadCustomRepositories } from "@medusajs/utils"
import * as defaultServices from "@services"
import { asClass } from "awilix"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    cartService: asClass(defaultServices.CartService).singleton(),
    addressService: asClass(defaultServices.AddressService).singleton(),
    shippingMethodService: asClass(
      defaultServices.ShippingMethodService
    ).singleton(),
    lineItemService: asClass(defaultServices.LineItemService).singleton(),
  })

  if (customRepositories) {
    loadCustomRepositories({
      defaultRepositories,
      customRepositories,
      container,
    })
  } else {
    loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(defaultRepositories.BaseRepository).singleton(),
    cartRepository: asClass(defaultRepositories.CartRepository).singleton(),
    addressRepository: asClass(
      defaultRepositories.AddressRepository
    ).singleton(),
    lineItemRepository: asClass(
      defaultRepositories.LineItemRepository
    ).singleton(),
    shippingMethodRepository: asClass(
      defaultRepositories.ShippingMethodRepository
    ).singleton(),
  })
}
