import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Address } from "@models"
import { CreateAddressDTO, UpdateAddressDTO } from "@types"

type InjectedDependencies = {
  addressRepository: DAL.RepositoryService
}

export default class AddressService<
  TEntity extends Address = Address
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateAddressDTO
    update: UpdateAddressDTO
  }
>(Address)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
