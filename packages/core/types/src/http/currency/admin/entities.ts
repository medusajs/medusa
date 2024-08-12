import { RawRounding } from "../../../common"
import { BaseCurrency } from "../common"

export interface AdminCurrency extends BaseCurrency {
  raw_rounding: RawRounding
  created_at: string
  updated_at: string
  deleted_at: string | null
}
