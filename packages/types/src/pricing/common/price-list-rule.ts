import { BaseFilterable } from "../../dal"
import { RuleTypeDTO } from "./rule-type"
import { PriceListDTO, PriceListRuleValueDTO } from "./price-list"

export interface PriceListRuleDTO {
  id: string
  value: string
  priority: number
  rule_type: RuleTypeDTO
  price_list: PriceListDTO
  price_list_rule_values?: PriceListRuleValueDTO[]
}

export interface CreatePriceListRuleDTO {
  rule_type_id?: string
  rule_type?: string | RuleTypeDTO
  price_list_id?: string
  price_list?: string | PriceListDTO
}

export interface UpdatePriceListRuleDTO {
  id: string
  price_list_id?: string
  rule_type_id?: string
}

export interface FilterablePriceListRuleProps
  extends BaseFilterable<FilterablePriceListRuleProps> {
  id?: string[]
  value?: string[]
  rule_type?: string[]
  price_list_id?: string[]
}
