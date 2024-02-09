export interface CreateShippingOptionRuleDTO {
  attribute: string
  operator: string
  value: string | string[]
  shipping_option_id: string
}

export interface UpdateShippingOptionRuleDTO
  extends Partial<CreateShippingOptionRuleDTO> {
  id: string
}
