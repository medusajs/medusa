import { ShippingOptionDTO } from "./shipping-option"

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
