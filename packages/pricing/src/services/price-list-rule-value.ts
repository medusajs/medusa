import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceListRuleValue } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRuleValueRepository: DAL.RepositoryService
}

export default class PriceListRuleValueService<
  TEntity extends PriceListRuleValue = PriceListRuleValue
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceListRuleValueDTO
    update: ServiceTypes.UpdatePriceListRuleValueDTO
  },
  {
    list: ServiceTypes.FilterablePriceListRuleValueProps
    listAndCount: ServiceTypes.FilterablePriceListRuleValueProps
  }
>(PriceListRuleValue)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
