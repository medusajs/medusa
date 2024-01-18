import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { ShippingMethod } from "@models"
import { CreateShippingMethodDTO, UpdateShippingMethodDTO } from "../types"

type InjectedDependencies = {
  shippingMethodRepository: DAL.RepositoryService
}

export default class ShippingMethodService<
  TEntity extends ShippingMethod = ShippingMethod
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateShippingMethodDTO
    update: UpdateShippingMethodDTO
  }
>(ShippingMethod)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
