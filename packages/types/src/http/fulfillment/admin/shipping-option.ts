import { ShippingOptionPriceType } from "../../../fulfillment"
import { RuleOperatorType } from "../../../common"
import {
  ServiceZoneDTO,
  ShippingOptionRuleDTO,
  ShippingOptionTypeDTO,
  ShippingProfileDTO,
} from "../dtos"

/**
 * @experimental
 */
export interface AdminPostCreateShippingOptionType {
  label: string
  description: string
  code: string
  shipping_option_id: string
}

/**
 * @experimental
 */
export interface AdminPostCreateShippingOptionRule {
  attribute: string
  operator: RuleOperatorType
  value: string | string[]
}

/**
 * @experimental
 */
export interface AdminPostCreateShippingOption {
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  type: AdminPostCreateShippingOptionType
  data?: Record<string, unknown> | null
  rules?: AdminPostCreateShippingOptionRule[]
}

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
  service_zone: ServiceZoneDTO
  shipping_profile: ShippingProfileDTO
  type: ShippingOptionTypeDTO
  rules: ShippingOptionRuleDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
