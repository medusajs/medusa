import { RuleOperatorType } from "../../common"
import { ShippingOptionPriceType } from "../../fulfillment"
import {
  BaseHttpFilterableWithDeletedAt,
  BaseSoftDeletableHttpEntity,
} from "../base"
import { DeleteResponse, PaginatedResponse } from "../common"
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
  value: string | string[] | null
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

export interface AdminShippingOptionFilters
  extends BaseHttpFilterableWithDeletedAt<AdminShippingOptionFilters> {
  service_zone_id?: string | string[]
  shipping_profile_id?: string | string[]
  provider_id?: string | string[]
  shipping_option_type_id?: string | string[]
}

export interface AdminCreateShippingOptionType {
  label: string
  description: string
  code: string
}

export interface AdminCreateShippingOptionPriceWithCurrency {
  currency_code: string
  amount: number
}

export interface AdminCreateShippingOptionPriceWithRegion {
  region_id: string
  amount: number
}

export interface AdminCreateShippingOptionRule {
  operator: RuleOperatorType
  attribute: string
  value: string | string[]
}

export interface AdminCreateShippingOption {
  name: string
  service_zone_id: string
  shipping_profile_id: string
  data?: Record<string, unknown>
  price_type?: ShippingOptionPriceType
  provider_id: string
  type: AdminCreateShippingOptionType
  prices: (
    | AdminCreateShippingOptionPriceWithCurrency
    | AdminCreateShippingOptionPriceWithRegion
  )[]
  rules?: AdminCreateShippingOptionRule[]
}

export interface AdminUpdateShippingOptionPriceWithCurrency {
  id?: string
  currency_code?: string
  amount?: number
}

export interface AdminUpdateShippingOptionPriceWithRegion {
  id?: string
  region_id?: string
  amount?: number
}

export interface AdminUpdateShippingOptionRule {
  id: string
  operator: RuleOperatorType
  attribute: string
  value: string | string[]
}

export interface AdminUpdateShippingOption {
  name?: string
  data?: Record<string, unknown>
  price_type?: ShippingOptionPriceType
  provider_id?: string
  shipping_profile_id?: string
  type?: AdminCreateShippingOptionType
  prices?: (
    | AdminUpdateShippingOptionPriceWithCurrency
    | AdminUpdateShippingOptionPriceWithRegion
  )[]
  rules?: AdminUpdateShippingOptionRule[]
}

export interface AdminShippingOptionDeleteResponse
  extends DeleteResponse<"shipping_option"> {}
