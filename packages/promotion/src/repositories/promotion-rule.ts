import { DALUtils } from "@medusajs/utils"
import { PromotionRule } from "@models"

export class PromotionRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PromotionRule
) {}
