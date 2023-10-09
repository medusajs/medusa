import { BaseFilterable } from "../../dal"
import { PriceSetMoneyAmountDTO } from "./price-set-money-amount"
import { RuleTypeDTO } from "./rule-type"

export interface PriceSetMoneyAmountRulesDTO {
  id: string
  price_set_money_amount: PriceSetMoneyAmountDTO
  rule_type: RuleTypeDTO
  value: string
}

export interface CreatePriceSetMoneyAmountRulesDTO {
  price_set_money_amount: string
  rule_type: string
  value: string
}

export interface UpdatePriceSetMoneyAmountRulesDTO {
  id: string
  price_set_money_amount?: string
  rule_type?: string
  value?: string
}

export interface FilterablePriceSetMoneyAmountRulesProps
  extends BaseFilterable<FilterablePriceSetMoneyAmountRulesProps> {
  id?: string[]
  rule_type_id?: string[]
  price_set_money_amount_id?: string[]
  value?: string[]
}
