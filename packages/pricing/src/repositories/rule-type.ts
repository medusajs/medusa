import { DALUtils } from "@medusajs/utils"
import { RuleType } from "@models"

export class RuleTypeRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  RuleType
) {}
