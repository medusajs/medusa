import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { loadCustomRepositories } from "@medusajs/utils"
import { asClass } from "awilix"
import * as defaultRepositories from "../repositories"
import * as defaultServices from "../services"

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
    lineItemAdjustmentService: asClass(
      defaultServices.LineItemAdjustmentService
    ).singleton(),
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
    lineItemAdjustmentRepository: asClass(
      defaultRepositories.LineItemAdjustmentRepository
    ).singleton(),
  })
}
