import { CreatePriceSetDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Price, PriceSet } from "@models"
import { defaultPriceSetsData } from "./data"

export * from "./data"

export async function createPriceSets(
  manager: SqlEntityManager,
  priceSetsData: CreatePriceSetDTO[] = defaultPriceSetsData
): Promise<PriceSet[]> {
  const priceSets: PriceSet[] = []

  for (let priceSetData of priceSetsData) {
    const priceSetDataClone = { ...priceSetData }
    const prices = priceSetDataClone.prices || []
    delete priceSetDataClone.prices

    let priceSet = manager.create(PriceSet, priceSetDataClone) as PriceSet

    manager.persist(priceSet)

    for (let priceData of prices) {
      const price = manager.create(Price, {
        ...priceData,
        price_set_id: priceSet.id,
        title: "test",
      })

      manager.persist(price)
    }

    await manager.flush()
  }

  return priceSets
}
