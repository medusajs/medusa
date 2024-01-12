import { DALUtils } from "@medusajs/utils"
import { RuleType } from "@models"
import { RepositoryTypes } from "@types"

export class RuleTypeRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  RuleType,
  {
    create: RepositoryTypes.CreateRuleTypeDTO
    update: RepositoryTypes.UpdateRuleTypeDTO
  }
>(RuleType) {
  // @ts-ignore
  constructor(...arguments: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
