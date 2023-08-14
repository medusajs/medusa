import { CartDTO } from "../cart"
import { ShippingOptionDTO } from "../shipping-option"

export type ShippingMethodTaxLineDTO = {
  shipping_method_id: string
  shipping_method: ShippingMethodDTO
  rate: number
  name: string
  code: string | null
  metadata: Record<string, unknown>
}

export type ShippingMethodDTO = {
  id: string
  shipping_option_id: string
  order_id: string
  // TODO: Replace with OrderDTO
  order: any
  claim_order_id: string | null
  // TODO: Replace with ClaimOrderDTO
  claim_order: any
  cart_id: string
  cart: CartDTO
  swap_id: string
  // TODO: Replace with SwapDTO
  swap: any
  return_id: string
  // TODO: Replace with ReturnDTO
  return_order: any
  shipping_option: ShippingOptionDTO
  tax_lines: ShippingMethodTaxLineDTO[]
  price: number
  data: Record<string, unknown>
  includes_tax: boolean

  deleted_at: Date | null

  subtotal?: number
  total?: number
  tax_total?: number
}
