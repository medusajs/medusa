import { BaseFilterable, PriceSetDTO, PriceSetMoneyAmountDTO, RuleTypeDTO } from "@medusajs/types"
import { PriceSet, PriceSetMoneyAmount, RuleType } from "@models"

export interface CreatePriceRuleDTO {
  id?: string
  price_set_id?: string
  price_set?: PriceSet | string
  rule_type_id?: string
  rule_type?: RuleType | string
  value: string
  priority?: number
  price_set_money_amount_id?: string
  price_set_money_amount?: PriceSetMoneyAmount | string
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

export interface PriceRuleDTO {
  id: string
  price_set_id: string
  price_set: PriceSetDTO
  rule_type_id: string
  rule_type: RuleTypeDTO
  value: string
  priority: number
  price_set_money_amount_id: string
  price_list_id: string
}

export interface FilterablePriceRuleProps
  extends BaseFilterable<FilterablePriceRuleProps> {
  id?: string[]
  name?: string[]
  price_set_id?: string[]
  rule_type_id?: string[]
}
