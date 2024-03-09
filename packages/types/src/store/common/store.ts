import { BaseFilterable } from "../../dal"

export interface StoreDTO {
  id: string
  name: string
  supported_currency_codes: string[]
  default_currency_code?: string
  default_sales_channel_id?: string
  default_region_id?: string
  default_location_id?: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}
export interface FilterableStoreProps
  extends BaseFilterable<FilterableStoreProps> {
  id?: string | string[]
  name?: string | string[]
}
