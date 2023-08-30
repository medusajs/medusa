import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Currency, MoneyAmount } from "@models"
import { defaultMoneyAmountsData } from "./data"

export async function createMoneyAmounts(
  manager: SqlEntityManager,
  moneyAmountsData: any[] = defaultMoneyAmountsData
): Promise<MoneyAmount[]> {
  const moneyAmounts: MoneyAmount[] = []

  for (let moneyAmountData of moneyAmountsData) {
    moneyAmountData = { ...moneyAmountData }
    const currencyCode = moneyAmountData.currency_code

    delete moneyAmountData.currency_code

    if (!currencyCode) {
      throw "currency_code is required"
    }

    const currency = await manager.findOne(Currency, currencyCode)

    Object.assign(moneyAmountData, { currency })

    const moneyAmount = manager.create(MoneyAmount, moneyAmountData)

    moneyAmounts.push(moneyAmount)
  }

  await manager.persistAndFlush(moneyAmounts)

  return moneyAmounts
}
