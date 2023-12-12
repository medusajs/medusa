export interface CreatePriceRuleDTO {
  id: string
  price_set_id: string
  rule_type_id: string
  value: string
  priority?: number
  price_set_money_amount_id: string
}

export interface UpdatePriceRuleDTO {
  id: string
  price_set_id?: string
  rule_type_id?: string
  value?: string
  priority?: number
  price_set_money_amount_id?: string
  price_list_id?: string
}
