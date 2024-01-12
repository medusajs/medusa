import { DALUtils } from "@medusajs/utils"
import { PromotionRule } from "@models"
import { CreatePromotionRuleDTO, UpdatePromotionRuleDTO } from "@types"

export class PromotionRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PromotionRule,
  {
    create: CreatePromotionRuleDTO
    update: UpdatePromotionRuleDTO
  }
>(PromotionRule) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
