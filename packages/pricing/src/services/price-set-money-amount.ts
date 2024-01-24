import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceSetMoneyAmount } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetMoneyAmountRepository: DAL.RepositoryService
}

export default class PriceSetMoneyAmountService<
  TEntity extends PriceSetMoneyAmount = PriceSetMoneyAmount
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceSetMoneyAmountDTO
    update: ServiceTypes.UpdatePriceSetMoneyAmountDTO
  },
  {
    list: ServiceTypes.FilterablePriceSetMoneyAmountProps
    listAndCount: ServiceTypes.FilterablePriceSetMoneyAmountProps
  }
>(PriceSetMoneyAmount)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
