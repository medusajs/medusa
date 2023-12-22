import { BaseFilterable } from "../../dal"

export type PromotionRuleOperator = "gt" | "lt" | "eq" | "ne" | "in"

export interface PromotionRuleDTO {
  id: string
}

export interface CreatePromotionRuleDTO {
  description?: string
  attribute: string
  operator: PromotionRuleOperator
  values: string[] | string
}

export interface UpdatePromotionRuleDTO {
  id: string
}

export interface FilterablePromotionRuleProps
  extends BaseFilterable<FilterablePromotionRuleProps> {
  id?: string[]
}
