import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceRule } from "@models"

import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceRuleRepository: DAL.RepositoryService
}

export default class PriceRuleService<
  TEntity extends PriceRule = PriceRule
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceRuleDTO
    update: ServiceTypes.UpdatePriceRuleDTO
  },
  {
    list: ServiceTypes.FilterablePriceRuleProps
    listAndCount: ServiceTypes.FilterablePriceRuleProps
  }
>(PriceRule)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
