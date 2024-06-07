import { ShippingOptionPriceType } from "../../../fulfillment"
import { AdminFulfillmentProvider } from "../../fulfillment-provider"
import { AdminServiceZone } from "../../fulfillment-set"
import { AdminPrice } from "../../pricing"
import { AdminShippingProfile } from "../../shipping-profile"

export interface AdminShippingOptionType {
  id: string
  label: string
  description: string
  code: string
  shipping_option_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminShippingOptionRule {
  id: string
  attribute: string
  operator: string
  value: string | string[] | null
  shipping_option_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminShippingOption {
  id: string
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  service_zone: AdminServiceZone
  provider_id: string
  provider: AdminFulfillmentProvider
  shipping_option_type_id: string | null
  type: AdminShippingOptionType
  shipping_profile_id: string
  shipping_profile: AdminShippingProfile
  rules: AdminShippingOptionRule[]
  prices: AdminPrice[]
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
