import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createPriceSetMoneyAmounts, defaultPricesData } from "./price"
import { createPriceRules, defaultPriceRuleData } from "./price-rule"
import { createPriceSets, defaultPriceSetsData } from "./price-set"
import { createRuleTypes, defaultRuleTypesData } from "./rule-type"

jest.setTimeout(30000)

export async function seedPriceData(
  testManager: SqlEntityManager,
  {
    priceSetsData = defaultPriceSetsData,
    priceRuleData = defaultPriceRuleData,
    pricesData = defaultPricesData,
    ruleTypesData = defaultRuleTypesData,
  } = {}
) {
  await createPriceSets(testManager, priceSetsData)
  await createPriceSetMoneyAmounts(testManager, pricesData)
  await createRuleTypes(testManager, ruleTypesData)
  await createPriceRules(testManager, priceRuleData)
}
