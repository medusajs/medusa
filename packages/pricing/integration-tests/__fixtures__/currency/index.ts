import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Currency } from "@models"
import { defaultCurrencyData } from "./data"

export async function createCurrencies(
  manager: SqlEntityManager,
  currencyData: any[] = defaultCurrencyData
): Promise<Currency[]> {
  const currencies: Currency[] = []

  for (let categoryData of currencyData) {
    const category = manager.create(Currency, categoryData)

    currencies.push(category)
  }

  await manager.persistAndFlush(currencies)

  return currencies
}
