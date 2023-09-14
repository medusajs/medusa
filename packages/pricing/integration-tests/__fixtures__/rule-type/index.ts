import { SqlEntityManager } from "@mikro-orm/postgresql"
import { RuleType } from "@models"
import { defaultRuleTypesData } from "./data"

export async function createRuleTypes(
  manager: SqlEntityManager,
  ruletypesData: any[] = defaultRuleTypesData
): Promise<RuleType[]> {
  const RuleTypes: RuleType[] = []

  for (let ruleTypeData of ruletypesData) {
    const ruleType = manager.create(RuleType, ruleTypeData)

    RuleTypes.push(ruleType)
  }

  await manager.persistAndFlush(RuleTypes)

  return RuleTypes
}
