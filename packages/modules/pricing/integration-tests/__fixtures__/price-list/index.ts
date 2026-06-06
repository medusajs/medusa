import { SqlEntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { PriceList } from "@models"
import { toMikroORMEntity } from "@zjedene-medusa/framework/utils"
import { defaultPriceListData } from "./data"

export * from "./data"

export async function createPriceLists(
  manager: SqlEntityManager,
  priceListData: any[] = defaultPriceListData
): Promise<PriceList[]> {
  const priceLists: PriceList[] = []

  for (let data of priceListData) {
    const pl = manager.create(toMikroORMEntity(PriceList), data)

    priceLists.push(pl)
  }

  await manager.persistAndFlush(priceLists)

  return priceLists
}
