import { PriceListDTO, RuleTypeDTO } from "../services"

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
  price_list?: string
  rule_type?: string
}
