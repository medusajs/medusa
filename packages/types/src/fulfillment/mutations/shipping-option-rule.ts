export type ShippingOptionRuleOperatorType =
  | "in"
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "nin"

export interface CreateShippingOptionRuleDTO {
  attribute: string
  operator: ShippingOptionRuleOperatorType
  value: string | string[]
  shipping_option_id: string
}

export interface UpdateShippingOptionRuleDTO
  extends Partial<CreateShippingOptionRuleDTO> {
  id: string
}
