import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceSetMoneyAmountRules } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetMoneyAmountRulesRepository: DAL.RepositoryService
}

export default class PriceSetMoneyAmountRulesService<
  TEntity extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceSetMoneyAmountRulesDTO
    update: ServiceTypes.UpdatePriceSetMoneyAmountRulesDTO
  },
  {
    list: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps
    listAndCount: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps
  }
>(PriceSetMoneyAmountRules)<TEntity> {
  constructor({ priceSetMoneyAmountRulesRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
