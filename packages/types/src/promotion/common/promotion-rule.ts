import { BaseFilterable } from "../../dal"

export type PromotionRuleOperatorValues =
  | "gt"
  | "lt"
  | "eq"
  | "ne"
  | "in"
  | "lte"
  | "gte"

export interface PromotionRuleDTO {
  id: string
}

export interface CreatePromotionRuleDTO {
  description?: string
  attribute: string
  operator: PromotionRuleOperatorValues
  values: string[] | string
}

export interface UpdatePromotionRuleDTO {
  id: string
}

export interface FilterablePromotionRuleProps
  extends BaseFilterable<FilterablePromotionRuleProps> {
  id?: string[]
}
