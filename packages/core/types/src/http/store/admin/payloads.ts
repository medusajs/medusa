interface AdminUpdateStoreSupportedCurrency {
  is_default?: boolean
  code: string
}

export interface AdminUpdateStore {
  name?: string | null
  supported_currencies?: AdminUpdateStoreSupportedCurrency[]
  default_sales_channel_id?: string | null
  default_region_id?: string | null
  default_location_id?: string | null
  metadata?: Record<string, any> | null
}
