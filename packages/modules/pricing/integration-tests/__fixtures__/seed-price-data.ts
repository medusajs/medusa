import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createPrices, defaultPricesData } from "./price"
import { createPriceRules, defaultPriceRuleData } from "./price-rule"
import { createPriceSets, defaultPriceSetsData } from "./price-set"

jest.setTimeout(30000)

export async function seedPriceData(
  testManager: SqlEntityManager,
  {
    priceSetsData = defaultPriceSetsData,
    priceRuleData = defaultPriceRuleData,
    pricesData = defaultPricesData,
  } = {}
) {
  await createPriceSets(testManager, priceSetsData)
  await createPrices(testManager, pricesData)
  await createPriceRules(testManager, priceRuleData)
}
