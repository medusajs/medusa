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
    const psmas = priceSetDataClone.prices || []
    delete priceSetDataClone.prices

    let priceSet = manager.create(PriceSet, priceSetDataClone) as PriceSet

    manager.persist(priceSet)

    for (let psmaData of psmas) {
      const psma = manager.create(Price, {
        ...psmaData,
        price_set_id: priceSet.id,
        title: "test",
      })

      manager.persist(psma)
    }

    await manager.flush()
  }

  return priceSets
}
