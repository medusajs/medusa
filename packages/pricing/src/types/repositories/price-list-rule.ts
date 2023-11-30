import { PriceList, RuleType } from "@models"

export interface CreatePriceListRuleDTO {
  rule_type_id?: string
  rule_type?: string | RuleType
  price_list_id?: string
  price_list?: string | PriceList
}

export interface UpdatePriceListRuleDTO {
  id: string
  price_list_id?: string
  rule_type_id?: string
  price_list?: string
  rule_type?: string
}
