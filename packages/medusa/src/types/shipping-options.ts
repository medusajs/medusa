import { RequirementType } from "../models/shipping-option-requirement"

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
  claim_order_id?: string
}

export type CreateShippingMethod = {
  data: any
  shipping_option_id: string
  price: number
  return_id?: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  draft_order_id?: string
  claim_order_id?: string
}
