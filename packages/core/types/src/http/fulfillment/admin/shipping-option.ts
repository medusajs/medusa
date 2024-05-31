import { ShippingOptionPriceType } from "../../../fulfillment"
import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminPriceSetPrice } from "../../pricing"
import { AdminFulfillmentProvider } from "./fulfillment-provider"
import { AdminServiceZoneResponse } from "./service-zone"
import { AdminShippingOptionRuleResponse } from "./shipping-option-rule"
import { AdminShippingOptionTypeResponse } from "./shipping-option-type"
import { AdminShippingProfileResponse } from "./shipping-profile"

export interface AdminShippingOptionResponse {
  id: string
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  shipping_option_type_id: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  service_zone: AdminServiceZoneResponse
  shipping_profile: AdminShippingProfileResponse
  provider: AdminFulfillmentProvider
  type: AdminShippingOptionTypeResponse
  rules: AdminShippingOptionRuleResponse[]
  prices: AdminPriceSetPrice[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface AdminShippingOptionRetrieveResponse {
  shipping_option: AdminShippingOptionResponse
}

export type AdminShippingOptionListResponse = PaginatedResponse<{
  shipping_options: AdminShippingOptionResponse[]
}>

export interface AdminShippingOptionDeleteResponse
  extends DeleteResponse<"shipping_option"> {}
