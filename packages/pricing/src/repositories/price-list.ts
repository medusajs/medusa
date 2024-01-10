import { Context } from "@medusajs/types"
import { DALUtils, GetIsoStringFromDate } from "@medusajs/utils"

import { PriceList } from "@models"
import { RepositoryTypes } from "@types"

export class PriceListRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceList,
  {
    create: RepositoryTypes.CreatePriceListDTO
  }
>(PriceList) {
  async update(
    data: RepositoryTypes.UpdatePriceListDTO[],
    context: Context = {}
  ): Promise<PriceList[]> {
    const priceLists = data.map((priceListData: any) => {
      if (!!priceListData.starts_at) {
        priceListData.starts_at = GetIsoStringFromDate(priceListData.starts_at)
      }

      if (!!priceListData.ends_at) {
        priceListData.ends_at = GetIsoStringFromDate(priceListData.ends_at)
      }

      return priceListData
    })

    return await super.update(priceLists, context)
  }
}
