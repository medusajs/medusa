import { CreatePriceSetDTO } from "@zjedene-medusa/framework/types"
import { SqlEntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { Price, PriceSet } from "@models"
import { toMikroORMEntity } from "@zjedene-medusa/framework/utils"
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

    let priceSet = manager.create(
      toMikroORMEntity(PriceSet),
      priceSetDataClone
    ) as PriceSet

    manager.persist(priceSet)

    for (let priceData of prices) {
      const price = manager.create(toMikroORMEntity(Price), {
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
