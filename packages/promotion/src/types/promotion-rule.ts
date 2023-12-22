import { PromotionRuleOperator } from "@medusajs/types"

export interface CreatePromotionRuleDTO {
  description?: string
  attribute: string
  operator: PromotionRuleOperator
}

export interface UpdatePromotionRuleDTO {
  id: string
}
