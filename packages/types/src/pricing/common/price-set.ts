import { BaseFilterable } from "../../dal"
import { FilterableMoneyAmountProps, MoneyAmountDTO } from "./money-amount"

export interface PricingContext {
  context?: Record<string, string | number>
}

export interface PricingFilters {
  id: string[]
}

export interface PriceSetDTO {
  id: string
  money_amounts?: MoneyAmountDTO[]
}

export interface CalculatedPriceSetDTO {
  id: string
  amount: number | null
  currency_code: string | null
  min_quantity: number | null
  max_quantity: number | null
}

export interface CreatePriceSetDTO {
  money_amounts?: MoneyAmountDTO[]
}

export interface UpdatePriceSetDTO {
  id: string
}

export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps> {
  id?: string[]
  money_amounts?: FilterableMoneyAmountProps
}
