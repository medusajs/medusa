import { SqlEntityManager } from "@mikro-orm/postgresql"
import { MoneyAmount } from "@models"
import { defaultMoneyAmountsData } from "./data"

export * from "./data"

export async function createMoneyAmounts(
  manager: SqlEntityManager,
  moneyAmountsData: any[] = defaultMoneyAmountsData
): Promise<MoneyAmount[]> {
  const moneyAmounts: MoneyAmount[] = []

  for (let moneyAmountData of moneyAmountsData) {
    const moneyAmount = manager.create(MoneyAmount, moneyAmountData)

    moneyAmounts.push(moneyAmount)
  }

  await manager.persistAndFlush(moneyAmounts)

  return moneyAmounts
}
