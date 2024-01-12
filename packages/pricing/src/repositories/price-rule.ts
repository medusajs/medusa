import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"

import { PriceRule } from "@models"
import { RepositoryTypes } from "@types"

export class PriceRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceRule,
  {
    update: RepositoryTypes.UpdatePriceRuleDTO
  }
>(PriceRule) {
  // @ts-ignore
  constructor(...arguments: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: RepositoryTypes.CreatePriceRuleDTO[],
    context: Context = {}
  ): Promise<PriceRule[]> {
    const toCreate = data.map((ruleData) => {
      const ruleDataClone = { ...ruleData } as any

      ruleDataClone.rule_type ??= ruleData.rule_type_id
      ruleDataClone.price_set ??= ruleData.price_set_id
      ruleDataClone.price_set_money_amount ??=
        ruleData.price_set_money_amount_id

      return ruleDataClone
    })

    return await super.create(toCreate, context)
  }
}
