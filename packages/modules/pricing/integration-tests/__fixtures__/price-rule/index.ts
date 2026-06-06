import { PriceRule } from "@models"

import { CreatePriceRuleDTO } from "@zjedene-medusa/framework/types"
import { SqlEntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { toMikroORMEntity } from "@zjedene-medusa/framework/utils"
import { defaultPriceRuleData } from "./data"

export * from "./data"
export * from "./operators"

export async function createPriceRules(
  manager: SqlEntityManager,
  pricesRulesData: CreatePriceRuleDTO[] = defaultPriceRuleData
): Promise<PriceRule[]> {
  const priceRules: PriceRule[] = []

  for (let priceRuleData of pricesRulesData) {
    const priceRuleDataClone: CreatePriceRuleDTO = { ...priceRuleData }

    priceRuleDataClone.price_set_id = priceRuleDataClone.price_set_id
    priceRuleDataClone.attribute = priceRuleDataClone.attribute
    priceRuleDataClone.price_id = priceRuleDataClone.price_id

    const priceRule = manager.create(
      toMikroORMEntity(PriceRule),
      priceRuleDataClone
    )

    priceRules.push(priceRule)
  }

  await manager.persistAndFlush(priceRules)

  return priceRules
}
