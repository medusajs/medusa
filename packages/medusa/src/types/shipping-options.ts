import { Cart, Order } from ".."
import { ShippingOptionPriceType } from "../models/shipping-option"
import {
  RequirementType,
  ShippingOptionRequirement,
} from "../models/shipping-option-requirement"

export type ShippingRequirement = {
  type: RequirementType
  amount: number
  id: string
}

export type ShippingMethodUpdate = {
  data?: any
  price?: number
  return_id?: string
  swap_id?: string
  order_id?: string
  claim_order_id?: string | null
}

export type ShippingOptionUpdate = {
  metadata?: object
  price_type?: ShippingOptionPriceType
  amount?: number
  name?: string
  admin_only?: boolean
  is_return?: boolean
  requirements?: ShippingOptionRequirement[]
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
