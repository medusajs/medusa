import { ServiceZoneDTO } from "./service-zone"
import { ShippingProfileDTO } from "./shipping-profile"
import { ServiceProviderDTO } from "./service-provider"
import { ShippingOptionTypeDTO } from "./shipping-option-type"
import { ShippingOptionRuleDTO } from "./shipping-option-rule"

export type ShippingOptionPriceType = "calculated" | "flat"

export interface ShippingOptionDTO {
  id: string
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  service_provider_id: string
  shipping_option_type_id: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  service_zone: ServiceZoneDTO
  shipping_profile: ShippingProfileDTO
  service_provider: ServiceProviderDTO
  shipping_option_type: ShippingOptionTypeDTO
  rules: ShippingOptionRuleDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
