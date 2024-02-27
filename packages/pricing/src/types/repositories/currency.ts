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
