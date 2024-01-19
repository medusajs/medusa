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
    customerService: asClass(defaultServices.CustomerService).singleton(),
    addressService: asClass(defaultServices.AddressService).singleton(),
    customerGroupService: asClass(
      defaultServices.CustomerGroupService
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
    customerRepository: asClass(
      defaultRepositories.CustomerRepository
    ).singleton(),
    addressRepository: asClass(
      defaultRepositories.AddressRepository
    ).singleton(),
    customerGroupRepository: asClass(
      defaultRepositories.CustomerGroupRepository
    ).singleton(),
  })
}
