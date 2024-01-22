import { Context, DAL } from "@medusajs/types"
import { GetIsoStringFromDate, ModulesSdkUtils } from "@medusajs/utils"
import { PriceList } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRepository: DAL.RepositoryService
}

export default class PriceListService<
  TEntity extends PriceList = PriceList
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {},
  {
    list: ServiceTypes.FilterablePriceListProps
    listAndCount: ServiceTypes.FilterablePriceListProps
  }
>(PriceList)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: ServiceTypes.CreatePriceListDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const priceLists = this.normalizePriceListDate(data)
    return await super.create(priceLists, sharedContext)
  }

  async update(
    data: ServiceTypes.UpdatePriceListDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const priceLists = this.normalizePriceListDate(data)
    return await super.update(priceLists, sharedContext)
  }

  protected normalizePriceListDate(
    data: (ServiceTypes.UpdatePriceListDTO | ServiceTypes.CreatePriceListDTO)[]
  ) {
    return data.map((priceListData: any) => {
      if (!!priceListData.starts_at) {
        priceListData.starts_at = GetIsoStringFromDate(priceListData.starts_at)
      }

      if (!!priceListData.ends_at) {
        priceListData.ends_at = GetIsoStringFromDate(priceListData.ends_at)
      }

      return priceListData
    })
  }
}
