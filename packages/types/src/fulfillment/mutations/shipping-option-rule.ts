export interface CreateShippingOptionRuleDTO {
  attribute: string
  operator: "in" | "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "nin"
  value: string | string[]
  shipping_option_id: string
}

export interface UpdateShippingOptionRuleDTO
  extends Partial<CreateShippingOptionRuleDTO> {
  id: string
}
