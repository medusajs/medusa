import { PromotionRuleDTO } from "@medusajs/types"

export interface CreatePromotionRuleValueDTO {
  value: any
  promotion_rule: string | PromotionRuleDTO
}

export interface UpdatePromotionRuleValueDTO {
  id: string
  value: any
  promotion_rule: string | PromotionRuleDTO
}
