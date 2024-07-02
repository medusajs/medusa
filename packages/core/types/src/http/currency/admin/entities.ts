import { RawRounding } from "../../../common"

export interface AdminCurrency {
  code: string
  symbol: string
  symbol_native: string
  name: string
  decimal_digits: number
  raw_rounding: RawRounding
  rounding: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}
