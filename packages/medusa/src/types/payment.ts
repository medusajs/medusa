import { Address, ShippingMethod } from "../models"

export type CreateSessionContext = {
  cart: {
    context: Record<string, unknown>
    id: string
    customer_id?: string
    email: string
    shipping_address: Address | null
    shipping_options: ShippingMethod["shipping_option"][]
  }
  customer?: { id: string; metadata: Record<string, unknown> }
  currency_code: string
  amount: number
  resource_id?: string
}
