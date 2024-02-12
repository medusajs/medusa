import { ShippingOptionDTO } from "./shipping-option"
import { BaseFilterable } from "../../dal"

export interface ShippingOptionTypeDTO {
  id: string
  label: string
  description: string
  code: string
  shipping_option_id: string
  shipping_option: ShippingOptionDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableShippingOptionTypeProps
  extends BaseFilterable<FilterableShippingOptionTypeProps> {
  id?: string | string[]
  label?: string | string[]
  description?: string | string[]
  code?: string | string[]
}
