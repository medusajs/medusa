import { BaseFilterable } from "@medusajs/types"
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

export interface PriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule: PriceListRule
}

export interface FilterablePriceListRuleValueProps
  extends BaseFilterable<FilterablePriceListRuleValueProps> {
  id?: string[]
  value?: string[]
  price_list_rule_id?: string[]
}
