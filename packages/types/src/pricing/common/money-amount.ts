import { BaseFilterable } from "../../dal"
import { CreateCurrencyDTO, CurrencyDTO } from "./currency"

export interface MoneyAmountDTO {
  id: string
  currency_code?: string
  currency?: CurrencyDTO
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

export interface CreateMoneyAmountDTO {
  id?: string
  currency_code: string
  currency?: CreateCurrencyDTO
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

export interface UpdateMoneyAmountDTO {
  id: string
  currency_code?: string
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

export interface FilterableMoneyAmountProps
  extends BaseFilterable<FilterableMoneyAmountProps> {
  id?: string[]
  currency_code?: string | string[]
}
