export interface CreateStoreDTO {
  name?: string
  supported_currency_codes?: string[]
  default_currency_code?: string
  default_sales_channel_id?: string
  default_region_id?: string
  default_location_id?: string
  metadata?: Record<string, any>
}

export interface UpsertStoreDTO {
  id?: string
  name?: string
  supported_currency_codes?: string[]
  default_currency_code?: string
  default_sales_channel_id?: string
  default_region_id?: string
  default_location_id?: string
  metadata?: Record<string, any>
}

export interface UpdateStoreDTO {
  name?: string
  supported_currency_codes?: string[]
  default_currency_code?: string
  default_sales_channel_id?: string
  default_region_id?: string
  default_location_id?: string
  metadata?: Record<string, any>
}
