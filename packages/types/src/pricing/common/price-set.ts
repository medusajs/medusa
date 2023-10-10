import { BaseFilterable } from "../../dal"
import {
  CreateMoneyAmountDTO,
  FilterableMoneyAmountProps,
  MoneyAmountDTO,
} from "./money-amount"
import { RuleTypeDTO } from "./rule-type"

export interface PricingContext {
  context?: Record<string, string | number>
}

export interface PricingFilters {
  id: string[]
}

export interface PriceSetDTO {
  id: string
  money_amounts?: MoneyAmountDTO[]
  rule_types?: RuleTypeDTO[]
}

export interface CalculatedPriceSetDTO {
  id: string
  amount: number | null
  currency_code: string | null
  min_quantity: number | null
  max_quantity: number | null
}

export interface AddRulesDTO {
  priceSetId: string
  rules: { attribute: string }[]
}

export interface AddPricesDTO {
  priceSetId: string
  prices: (CreateMoneyAmountDTO & {
    rules?: Record<string, string>
  })[]
}
export interface RemovePriceSetRulesDTO {
  id: string
  rules: string[]
}

export interface CreatePriceSetDTO {
  rules?: { rule_attribute: string }[]
  prices?: (CreateMoneyAmountDTO & { rules: Record<string, string> })[]
}

export interface UpdatePriceSetDTO {
  id: string
}

export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps> {
  id?: string[]
  money_amounts?: FilterableMoneyAmountProps
}
