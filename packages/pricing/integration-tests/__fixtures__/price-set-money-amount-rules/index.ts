import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSetMoneyAmountRules } from "@models"
import { defaultPriceSetMoneyAmountRulesData } from "./data"

export * from "./data"

export async function createPriceSetMoneyAmountRules(
  manager: SqlEntityManager,
  psmarData: any[] = defaultPriceSetMoneyAmountRulesData
): Promise<PriceSetMoneyAmountRules[]> {
  const priceSetMoneyAmountRules: PriceSetMoneyAmountRules[] = []

  for (let data of psmarData) {
    const psmar = manager.create(PriceSetMoneyAmountRules, data)

    priceSetMoneyAmountRules.push(psmar)
  }

  await manager.persistAndFlush(priceSetMoneyAmountRules)

  return priceSetMoneyAmountRules
}
