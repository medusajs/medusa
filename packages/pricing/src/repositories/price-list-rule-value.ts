import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"

import { PriceListRuleValue } from "@models"
import { RepositoryTypes } from "@types"

export class PriceListRuleValueRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceListRuleValue,
  {
    update: RepositoryTypes.UpdatePriceListRuleValueDTO
  }
>(PriceListRuleValue) {
  async create(
    data: RepositoryTypes.CreatePriceListRuleValueDTO[],
    context: Context = {}
  ): Promise<PriceListRuleValue[]> {
    const priceListRuleValues = data.map((priceRuleValueData) => {
      const { price_list_rule_id: priceListRuleId, ...priceRuleValue } =
        priceRuleValueData

      if (priceListRuleId) {
        priceRuleValue.price_list_rule = priceListRuleId
      }

      return priceRuleValue
    })

    return await super.create(priceListRuleValues, context)
  }
}
