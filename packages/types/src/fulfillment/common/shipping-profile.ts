import { ShippingOptionDTO } from "./shipping-option"

export type ShippingProfileType = "default" | "gift_card" | "custom"

export interface ShippingProfileDTO {
  id: string
  type: ShippingProfileType
  metadata: Record<string, unknown> | null
  shipping_options: ShippingOptionDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
