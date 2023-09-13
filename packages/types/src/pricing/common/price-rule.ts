import { BaseFilterable } from "../../dal"
import { PriceSetDTO } from "./price-set"
import { RuleTypeDTO } from "./rule-type"

export interface PriceRuleDTO {
  id: string
  price_set_id: string
  price_set: PriceSetDTO
  rule_type_id: string
  rule_type: RuleTypeDTO
  is_dynamic: boolean
  value: string
  priority: number
  price_set_money_amount_id: string
  price_list_id: string
}

export interface CreatePriceRuleDTO {
  id: string
  price_set_id: string
  rule_type_id: string
  is_dynamic?: boolean
  value: string
  priority?: number
  price_set_money_amount_id: string 
  price_list_id: string
}

export interface UpdatePriceRuleDTO {
  id: string
  price_set_id?: string
  rule_type_id?: string
  is_dynamic?: boolean
  value?: string
  priority?: number
  price_set_money_amount_id?: string
  price_list_id?: string
}

export interface FilterablePriceRuleProps
  extends BaseFilterable<FilterablePriceRuleProps> {
  id?: string[]
  name?: string[]
}
