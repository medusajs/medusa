import { SqlEntityManager } from "@mikro-orm/postgresql"
import { MoneyAmount, PriceList } from "@models"
import { defaultPriceListData } from "./data"

export async function createPriceLists(
  manager: SqlEntityManager,
  priceListsData: any[] = defaultPriceListData,
): Promise<MoneyAmount[]> {
  const priceLists: PriceList[] = []
  const moneyAmounts: MoneyAmount[] = []

  for (let priceListdata of priceListsData) {
    const { prices, ...rest } = priceListdata
    const priceList = manager.create(MoneyAmount, rest)
    priceLists.push(priceList)

    const createdPrices = manager.create(MoneyAmount, prices)
    moneyAmounts.push(createdPrices)
  }

  await manager.persistAndFlush(priceLists)
  await manager.persistAndFlush(moneyAmounts)

  return priceLists
}
