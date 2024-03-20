import { CreateShippingOptionTypeDTO } from "./shipping-option-type"
import { ShippingOptionPriceType } from "../common"
import { CreateShippingOptionRuleDTO } from "./shipping-option-rule"

export interface CreateShippingOptionDTO {
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  type: Omit<CreateShippingOptionTypeDTO, "shipping_option_id">
  data?: Record<string, unknown> | null
  rules?: Omit<CreateShippingOptionRuleDTO, "shipping_option_id">[]
  conditions?: Record<string, unknown> | null
}

export interface UpdateShippingOptionDTO {
  id: string
  name?: string
  price_type?: ShippingOptionPriceType
  service_zone_id?: string
  shipping_profile_id?: string
  provider_id?: string
  type: Omit<CreateShippingOptionTypeDTO, "shipping_option_id"> | { id: string }
  data?: Record<string, unknown> | null
  rules?: (
    | Omit<CreateShippingOptionRuleDTO, "shipping_option_id">
    | { id: string }
  )[]
}
