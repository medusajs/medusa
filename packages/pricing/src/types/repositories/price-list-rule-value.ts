import { PriceListRule } from "@models"
import { PriceListRuleDTO } from "./price-list-rule"

export interface PriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule: PriceListRuleDTO
}

export interface CreatePriceListRuleValueDTO {
  price_list_rule_id?: string
  price_list_rule: PriceListRule | string
  value: string
}

export interface UpdatePriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule_id: string
}
