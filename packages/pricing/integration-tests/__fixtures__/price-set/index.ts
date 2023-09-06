import { CreatePriceSetDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet } from "@models"
import { defaultPriceSetsData } from "./data"

export async function createPriceSets(
  manager: SqlEntityManager,
  priceSetsData: CreatePriceSetDTO[] = defaultPriceSetsData
): Promise<PriceSet[]> {
  const priceSets: PriceSet[] = []

  for (let moneyAmountData of priceSetsData) {
    const priceSet = manager.create(PriceSet, moneyAmountData)

    priceSets.push(priceSet)
  }

  await manager.persistAndFlush(priceSets)

  return priceSets
}
