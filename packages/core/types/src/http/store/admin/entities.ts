import { AdminCurrency } from "../../currency"

export interface AdminStoreCurrency {
  id: string
  currency_code: string
  store_id: string
  is_default: boolean
  currency: AdminCurrency
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminStore {
  id: string
  name: string
  supported_currencies: AdminStoreCurrency[]
  default_sales_channel_id: string | null
  default_region_id: string | null
  default_location_id: string | null
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}
