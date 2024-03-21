import { SqlEntityManager } from "@mikro-orm/postgresql"

import { createMoneyAmounts, defaultMoneyAmountsData } from "./money-amount"
import { createPriceRules, defaultPriceRuleData } from "./price-rule"
import { createPriceSets, defaultPriceSetsData } from "./price-set"
import {
  createPriceSetMoneyAmounts,
  defaultPriceSetMoneyAmountsData,
} from "./price-set-money-amount"
import { createRuleTypes, defaultRuleTypesData } from "./rule-type"

jest.setTimeout(30000)

export async function seedPriceData(
  testManager: SqlEntityManager,
  {
    moneyAmountsData = defaultMoneyAmountsData,
    priceSetsData = defaultPriceSetsData,
    priceRuleData = defaultPriceRuleData,
    priceSetMoneyAmountsData = defaultPriceSetMoneyAmountsData,
    ruleTypesData = defaultRuleTypesData,
  } = {}
) {
  await createMoneyAmounts(testManager, moneyAmountsData)
  await createPriceSets(testManager, priceSetsData)
  await createPriceSetMoneyAmounts(testManager, priceSetMoneyAmountsData)
  await createRuleTypes(testManager, ruleTypesData)
  await createPriceRules(testManager, priceRuleData)
}
