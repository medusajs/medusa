import { SqlEntityManager } from "@mikro-orm/postgresql"
import { RuleType } from "@models"
import { defaultRuleTypesData } from "./data"

export * from "./data"

export async function createRuleTypes(
  manager: SqlEntityManager,
  ruletypesData: any[] = defaultRuleTypesData
): Promise<RuleType[]> {
  const ruleTypes: RuleType[] = []

  for (let ruleTypeData of ruletypesData) {
    const ruleType = manager.create(RuleType, ruleTypeData)

    ruleTypes.push(ruleType)
  }

  await manager.persistAndFlush(ruleTypes)

  return ruleTypes
}
