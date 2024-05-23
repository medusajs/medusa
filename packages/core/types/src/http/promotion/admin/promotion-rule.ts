export interface PromotionRuleResponse {
  id: string
  attribute: string
  attribute_label: string
  field_type: string
  operator: string
  operator_label: string
  values: { value: string }[]
  disguised: boolean
  required: boolean
}

export interface AdminPromotionRuleListResponse {
  attributes: PromotionRuleResponse[]
}
