import { PromotionRuleOperatorValues } from "@medusajs/types"

export interface CreatePromotionRuleDTO {
  description?: string | null
  attribute: string
  operator: PromotionRuleOperatorValues
}

export interface UpdatePromotionRuleDTO {
  id: string
}
