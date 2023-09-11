import { BaseFilterable } from "../../dal"
import { FilterableMoneyAmountProps, MoneyAmountDTO } from "./money-amount"

export interface PriceSetDTO {
  id: string
  money_amounts?: MoneyAmountDTO[]
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
