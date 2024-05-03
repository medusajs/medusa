import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Price } from "@models"
import { defaultPricesData } from "./data"

export * from "./data"

export async function createPrices(
  manager: SqlEntityManager,
  pricesData: any[] = defaultPricesData
): Promise<Price[]> {
  const prices: Price[] = []

  for (let data of pricesData) {
    const price = manager.create(Price, data)
    prices.push(price)
  }

  await manager.persistAndFlush(prices)

  return prices
}
