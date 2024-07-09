interface AdminUpdateStoreSupportedCurrency {
  currency_code: string
  is_default?: boolean
  is_tax_inclusive?: boolean
}

export interface AdminUpdateStore {
  name?: string
  supported_currencies?: AdminUpdateStoreSupportedCurrency[]
  default_sales_channel_id?: string | null
  default_region_id?: string | null
  default_location_id?: string | null
  metadata?: Record<string, any> | null
}
