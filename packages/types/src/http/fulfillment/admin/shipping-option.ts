import { ShippingOptionPriceType } from "../../../fulfillment"
import { AdminServiceZoneResponse } from "./service-zone"
import { AdminShippingOptionTypeResponse } from "./shipping-option-type"
import { AdminShippingOptionRuleResponse } from "./shipping-option-rule"
import { AdminShippingProfileResponse } from "./shipping-profile"
import { AdminFulfillmentProviderResponse } from "./fulfillment-provider"
import { AdminFulfillmentResponse } from "./fulfillment"

/**
 * @experimental
 */
export interface AdminPostCreateShippingOptionResponse {
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
  fulfillment_provider: AdminFulfillmentProviderResponse
  type: AdminShippingOptionTypeResponse
  rules: AdminShippingOptionRuleResponse[]
  fulfillments: AdminFulfillmentResponse[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
