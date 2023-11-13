import { BaseFilterable } from "@medusajs/types"
import { FilterableMoneyAmountProps, MoneyAmountDTO } from "./money-amount"
import { RuleTypeDTO } from "./rule-type"

export interface PriceSetDTO {
  id: string
  money_amounts?: MoneyAmountDTO[]
  rule_types?: RuleTypeDTO[]
}

export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps> {
  id?: string[]
  money_amounts?: FilterableMoneyAmountProps
}

export interface UpdatePriceSetDTO {
  id: string
}

export interface CreatePriceSetDTO {
  id?: string
}
