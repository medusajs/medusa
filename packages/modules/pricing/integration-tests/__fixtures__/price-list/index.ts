import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceList } from "@models"
import { defaultPriceListData } from "./data"

export * from "./data"

export async function createPriceLists(
  manager: SqlEntityManager,
  priceListData: any[] = defaultPriceListData
): Promise<PriceList[]> {
  const priceLists: PriceList[] = []

  for (let data of priceListData) {
    const pl = manager.create(PriceList, data)

    priceLists.push(pl)
  }

  await manager.persistAndFlush(priceLists)

  return priceLists
}
