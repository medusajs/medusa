import { InferEntityType, PromotionRuleDTO } from "@medusajs/framework/types"
import { PromotionRule } from "@models"

export interface CreatePromotionRuleValueDTO {
  value: any
  promotion_rule:
    string | PromotionRuleDTO | InferEntityType<typeof PromotionRule>
}

export interface UpdatePromotionRuleValueDTO {
  id: string
  value: any
  promotion_rule:
    string | PromotionRuleDTO | InferEntityType<typeof PromotionRule>
}
