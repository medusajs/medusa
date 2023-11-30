import { BaseFilterable, PriceListRuleDTO } from "@medusajs/types"

export interface CreatePriceListRuleValueDTO {
  price_list_rule_id?: string
  price_list_rule: PriceListRuleDTO | string
  value: string
}

export interface UpdatePriceListRuleValueDTO {
  id: string
  value: string
}

export interface PriceListRuleValueDTO {
  id: string
  value: string
  price_list_rule: PriceListRuleDTO
}

export interface FilterablePriceListRuleValueProps
  extends BaseFilterable<FilterablePriceListRuleValueProps> {
  id?: string[]
  value?: string[]
  price_list_rule_id?: string[]
}
