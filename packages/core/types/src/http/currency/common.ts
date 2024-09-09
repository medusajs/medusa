export interface BaseCurrency {
  code: string
  symbol: string
  symbol_native: string
  name: string
  decimal_digits: number
  rounding: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}
