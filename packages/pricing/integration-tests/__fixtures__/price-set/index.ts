import { CreatePriceSetDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet, PriceSetMoneyAmount } from "@models"
import { defaultPriceSetsData } from "./data"

export * from "./data"

export async function createPriceSets(
  manager: SqlEntityManager,
  priceSetsData: CreatePriceSetDTO[] = defaultPriceSetsData
): Promise<PriceSet[]> {
  const priceSets: PriceSet[] = []

  for (let priceSetData of priceSetsData) {
    const priceSetDataClone = { ...priceSetData }
    const moneyAmountsData = priceSetDataClone.prices || []
    delete priceSetDataClone.prices

    let priceSet = manager.create(PriceSet, priceSetDataClone) as PriceSet

    manager.persist(priceSet)

    for (let moneyAmount of moneyAmountsData) {
      const psma = manager.create(PriceSetMoneyAmount, {
        price_set: priceSet,
        money_amount: moneyAmount.id,
        title: "test",
      })

      manager.persist(psma)
    }

    await manager.flush()
  }

  return priceSets
}
