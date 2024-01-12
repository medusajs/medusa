import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"

import { PriceListRule } from "@models"
import { RepositoryTypes } from "@types"

export class PriceListRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PriceListRule
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: RepositoryTypes.CreatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const priceListRule = data.map((priceListRule) => {
      const {
        price_list_id: priceListId,
        rule_type_id: ruleTypeId,
        ...createData
      } = priceListRule

      if (priceListId) {
        createData.price_list = priceListId
      }

      if (ruleTypeId) {
        createData.rule_type = ruleTypeId
      }

      return createData
    })

    return await super.create(priceListRule, context)
  }

  async update(
    data: RepositoryTypes.UpdatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const priceListRules = data.map((priceListRule) => {
      const { price_list_id, rule_type_id, ...priceListRuleData } =
        priceListRule

      if (price_list_id) {
        priceListRuleData.price_list = price_list_id
      }

      if (rule_type_id) {
        priceListRuleData.rule_type = rule_type_id
      }

      return priceListRuleData
    })

    return await super.update(priceListRules, context)
  }
}
