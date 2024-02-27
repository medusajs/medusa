import { BaseFilterable } from "@medusajs/types"

export interface CreateCurrencyDTO {
  code: string
  symbol: string
  symbol_native: string
  name: string
}

export interface UpdateCurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}

export interface FilterableCurrencyProps
  extends BaseFilterable<FilterableCurrencyProps> {
  code?: string[]
}

export interface CurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}
