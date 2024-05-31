import { ShippingOptionPriceType } from "../../fulfillment"
import { BaseSoftDeletableHttpEntity } from "../base"
import { PaginatedResponse } from "../common"
import { AdminFulfillmentProvider } from "../fulfillment"
import { AdminServiceZone } from "../fulfillment-set"
import { AdminPriceSetPrice } from "../pricing"
import { AdminShippingProfile } from "../shipping-profile"

export interface AdminShippingOptionType extends BaseSoftDeletableHttpEntity {
  label: string
  description: string
  code: string
  shipping_option_id: string
}

export interface AdminShippingOptionRule extends BaseSoftDeletableHttpEntity {
  attribute: string
  operator: string
  value: { value: string | string[] } | null
  shipping_option_id: string
}

export interface AdminShippingOption extends BaseSoftDeletableHttpEntity {
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  shipping_option_type_id: string | null
  data: Record<string, unknown> | null
  service_zone: AdminServiceZone
  shipping_profile: AdminShippingProfile
  provider: AdminFulfillmentProvider
  type: AdminShippingOptionType
  rules: AdminShippingOptionRule[]
  prices: AdminPriceSetPrice[]
}

export interface AdminShippingOptionResponse {
  shipping_option: AdminShippingOption
}

export interface AdminShippingOptionListResponse
  extends PaginatedResponse<{
    shipping_options: AdminShippingOption[]
  }> {}
