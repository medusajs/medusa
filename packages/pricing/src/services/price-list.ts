import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceList } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRepository: DAL.RepositoryService
}

export default class PriceListService<
  TEntity extends PriceList = PriceList
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceListDTO
    update: ServiceTypes.UpdatePriceListDTO
  },
  {
    list: ServiceTypes.FilterablePriceListProps
    listAndCount: ServiceTypes.FilterablePriceListProps
  }
>(PriceList)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
