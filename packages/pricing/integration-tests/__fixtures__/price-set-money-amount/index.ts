import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSetMoneyAmount } from "@models"
import { defaultPriceSetMoneyAmountsData } from "./data"

export * from "./data"

export async function createPriceSetMoneyAmounts(
  manager: SqlEntityManager,
  psmaData: any[] = defaultPriceSetMoneyAmountsData
): Promise<PriceSetMoneyAmount[]> {
  const priceSetMoneyAmount: PriceSetMoneyAmount[] = []

  for (let data of psmaData) {
    const psmar = manager.create(PriceSetMoneyAmount, data)

    priceSetMoneyAmount.push(psmar)
  }

  await manager.persistAndFlush(priceSetMoneyAmount)

  return priceSetMoneyAmount
}
