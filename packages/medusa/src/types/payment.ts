import { Cart } from "../models"

export type CreateSessionContext = {
  // TODO: type Cart is meant for backward compatibility and will be replaced by the type in comment bellow instead in the future
  cart: Cart
  /* | {
        context: Record<string, unknown>
        id: string
        customer_id?: string
        email: string
        shipping_address: Address | null
        shipping_options: ShippingMethod["shipping_option"][]
      }*/
  customer?: {
    id: string

    // The paymentCustomerId returned by the plugin will be stored here
    metadata: Record<string, unknown>
  }
  currency_code: string
  amount: number
  resource_id?: string
}
