import { Address, Cart, ShippingMethod } from "../models"

export type PaymentSessionInput = {
  provider_id: string
  // TODO: Support legacy payment provider API> Once we are ready to break the api then we can remove the Cart type
  cart:
    | Cart
    | {
        context: Record<string, unknown>
        id: string
        email: string
        shipping_address: Address | null
        shipping_methods: ShippingMethod[]
      }
  customer?: {
    id: string

    // If the payment plugin return some data to collect on the customer, they will be store in the metadata
    metadata: Record<string, unknown>
  } | null
  currency_code: string
  amount: number
  resource_id?: string
}
