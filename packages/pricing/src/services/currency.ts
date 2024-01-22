import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Currency } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  currencyRepository: DAL.RepositoryService
}

export default class CurrencyService<
  TEntity extends Currency = Currency
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateCurrencyDTO
    update: ServiceTypes.UpdateCurrencyDTO
  }
>(Currency)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
