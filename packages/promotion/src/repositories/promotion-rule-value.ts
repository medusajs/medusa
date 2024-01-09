import { DALUtils } from "@medusajs/utils"
import { PromotionRuleValue } from "@models"

export class PromotionRuleValueRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PromotionRuleValue
) {}
