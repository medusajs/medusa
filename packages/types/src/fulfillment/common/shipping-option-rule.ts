import { ShippingOptionDTO } from "./shipping-option"
import { BaseFilterable } from "../../dal"

export interface ShippingOptionRuleDTO {
  id: string
  attribute: string
  operator: string
  value: { value: string | string[] } | null
  shipping_option_id: string
  shipping_option: ShippingOptionDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableShippingOptionRuleProps
  extends BaseFilterable<FilterableShippingOptionRuleProps> {
  id?: string | string[]
  attribute?: string | string[]
  operator?: string | string[]
  value?: string | string[]
}
