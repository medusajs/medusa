import { RawRounding } from "../../common"

export interface BaseCurrency {
  code: string
  symbol: string
  symbol_native: string
  name: string
  decimal_digits: number
  rounding: number
  raw_rounding: RawRounding
  created_at: string
  updated_at: string
  deleted_at: string | null
}
