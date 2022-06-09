import { Cart, Order } from ".."
import { ShippingOptionPriceType } from "../models/shipping-option"
import { ShippingOptionRequirement } from "../models/shipping-option-requirement"

export type CreateShippingOptionProps = {
  price_type: ShippingOptionPriceType
  name: string
  region_id: string
  profile_id: string
  provider_id: string
  data: Record<string, unknown>

  amount?: number
  is_return?: boolean
  admin_only?: boolean
  metadata?: Record<string, unknown>
  requirements?: ShippingOptionRequirement[]
}

export type UpdateShippingOptionProps = {
  metadata?: Record<string, unknown>
  price_type?: ShippingOptionPriceType
  amount?: number
  name?: string
  admin_only?: boolean
  is_return?: boolean
  requirements?: ShippingOptionRequirement[]
  region_id?: string
  provider_id?: string
  data?: string
}

export type ShippingMethodUpdate = {
  data?: any
  price?: number
  return_id?: string
  swap_id?: string
  order_id?: string
  claim_order_id?: string
}

export type CreateShippingMethod = {
  data?: any
  shipping_option_id?: string
  price?: number
  return_id?: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  draft_order_id?: string
  claim_order_id?: string
}

export type CreateShippingMethodDto = CreateShippingMethod & {
  cart?: Cart
  order?: Order
}
