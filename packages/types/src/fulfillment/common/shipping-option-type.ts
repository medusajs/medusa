import { ShippingOptionDTO } from "./shipping-option"

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
