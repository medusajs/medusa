import { PriceRule } from "@models"

import { CreatePriceRuleDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { defaultPriceRuleData } from "./data"

export * from "./data"

export async function createPriceRules(
  manager: SqlEntityManager,
  pricesRulesData: CreatePriceRuleDTO[] = defaultPriceRuleData
): Promise<PriceRule[]> {
  const priceRules: PriceRule[] = []

  for (let priceRuleData of pricesRulesData) {
    const priceRuleDataClone: CreatePriceRuleDTO = { ...priceRuleData }

    priceRuleDataClone.price_set_id = priceRuleDataClone.price_set_id
    priceRuleDataClone.rule_type_id = priceRuleDataClone.rule_type_id
    priceRuleDataClone.price_id = priceRuleDataClone.price_id

    const priceRule = manager.create(PriceRule, priceRuleDataClone)

    priceRules.push(priceRule)
  }

  await manager.persistAndFlush(priceRules)

  return priceRules
}
