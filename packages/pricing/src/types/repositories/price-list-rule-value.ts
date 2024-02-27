import { PriceListRule } from "@models"

export interface CreatePriceListRuleValueDTO {
  price_list_rule_id?: string
  price_list_rule: PriceListRule | string
  value: string
}

export interface UpdatePriceListRuleValueDTO {
  id: string
  value: string
}
