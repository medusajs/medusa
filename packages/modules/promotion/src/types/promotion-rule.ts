import { PromotionRuleOperatorValues } from "@zjedene-medusa/framework/types"

export interface CreatePromotionRuleDTO {
  description?: string | null
  attribute: string
  operator: PromotionRuleOperatorValues
}

export interface UpdatePromotionRuleDTO {
  id: string
}

export enum ApplicationMethodRuleTypes {
  TARGET_RULES = "target_rules",
  BUY_RULES = "buy_rules",
}
