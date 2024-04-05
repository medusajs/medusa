import { ShippingOptionPriceType } from "../../../fulfillment"
import { RuleOperatorType } from "../../../common"

export interface AdminPostCreateShippingOptionType {
  label: string
  description: string
  code: string
  shipping_option_id: string
}

export interface AdminPostCreateShippingOptionRule {
  attribute: string
  operator: RuleOperatorType
  value: string | string[]
}

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
