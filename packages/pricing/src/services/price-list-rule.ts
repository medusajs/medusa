import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceListRule } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRuleRepository: DAL.RepositoryService
}

export default class PriceListRuleService<
  TEntity extends PriceListRule = PriceListRule
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceListRuleDTO
    update: ServiceTypes.UpdatePriceListRuleDTO
  },
  {
    list: ServiceTypes.FilterablePriceListRuleProps
    listAndCount: ServiceTypes.FilterablePriceListRuleProps
  }
>(PriceListRule)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
