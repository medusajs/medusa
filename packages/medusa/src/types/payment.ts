import { Address, ShippingMethod } from "../models"

export type PaymentSessionInput = {
  provider_id: string
  cart: {
    context: Record<string, unknown>
    id: string
    email: string
    shipping_address: Address | null
    shipping_methods: ShippingMethod[]
  }
  customer?: {
    id: string

    // The paymentCustomerId returned by the plugin will be stored here
    metadata: Record<string, unknown>
  } | null
  currency_code: string
  amount: number
  resource_id?: string
}
