import { SqlEntityManager } from "@mikro-orm/postgresql"
import { RuleType } from "@models"
import { defaultRuleTypesData } from "./data"

export async function createRuleTypes(
  manager: SqlEntityManager,
  ruletypesData: any[] = defaultRuleTypesData
): Promise<RuleType[]> {
  const RuleTypes: RuleType[] = []

  for (let moneyAmountData of ruletypesData) {
    const moneyAmount = manager.create(RuleType, moneyAmountData)

    RuleTypes.push(moneyAmount)
  }

  await manager.persistAndFlush(RuleTypes)

  return RuleTypes
}
