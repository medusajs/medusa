import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { MoneyAmount } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  moneyAmountRepository: DAL.RepositoryService
}

export default class MoneyAmountService<
  TEntity extends MoneyAmount = MoneyAmount
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateMoneyAmountDTO
    update: ServiceTypes.UpdateMoneyAmountDTO
  },
  {
    list: ServiceTypes.FilterableMoneyAmountProps
    listAndCount: ServiceTypes.FilterableMoneyAmountProps
  }
>(MoneyAmount)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
