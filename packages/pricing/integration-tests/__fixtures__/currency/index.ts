import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Currency } from "@models"
import { defaultCurrencyData } from "./data"

export * from "./data"

export async function createCurrencies(
  manager: SqlEntityManager,
  currencyData: any[] = defaultCurrencyData
): Promise<Currency[]> {
  const currencies: Currency[] = []

  for (let curr of currencyData) {
    const currency = manager.create(Currency, curr)

    currencies.push(currency)
  }

  await manager.persistAndFlush(currencies)

  return currencies
}
