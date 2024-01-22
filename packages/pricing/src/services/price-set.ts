import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceSet } from "@models"

import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetRepository: DAL.RepositoryService
}

export default class PriceSetService<
  TEntity extends PriceSet = PriceSet
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: Omit<ServiceTypes.CreatePriceSetDTO, "rules">
    update: Omit<ServiceTypes.UpdatePriceSetDTO, "rules">
  },
  {
    list: ServiceTypes.FilterablePriceSetProps
    listAndCount: ServiceTypes.FilterablePriceSetProps
  }
>(PriceSet)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
