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
    const moneyAmountsData = priceSetDataClone.money_amounts || []
    delete priceSetDataClone.money_amounts

    let priceSet = manager.create(PriceSet, priceSetDataClone) as PriceSet

    await manager.persist(priceSet).flush()

    for (let moneyAmount of moneyAmountsData) {
      const price_set = (await manager.findOne(
        PriceSet,
        priceSet.id
      )) as PriceSet

      const psma = manager.create(PriceSetMoneyAmount, {
        price_set: price_set.id,
        money_amount: moneyAmount.id,
        title: "test",
      })

      manager.persist(psma).flush()
    }
  }

  return priceSets
}
