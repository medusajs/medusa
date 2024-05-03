import { PromotionRuleDTO } from "@medusajs/types"
import { PromotionRule } from "@models"

export interface CreatePromotionRuleValueDTO {
  value: any
  promotion_rule: string | PromotionRuleDTO | PromotionRule
}

export interface UpdatePromotionRuleValueDTO {
  id: string
  value: any
  promotion_rule: string | PromotionRuleDTO | PromotionRule
}
