import { Address, Customer, ShippingMethod } from "../models"

export type PaymentProcessorContext = {
  cart?: {
    context: Record<string, unknown>
    id: string
    email: string
    shipping_address: Address | null
    shipping_methods: ShippingMethod[]
  }
  currency_code: string
  amount: number
  resource_id?: string
  customer?: Customer
}

export type PaymentProcessorSessionResponse = {
  update_requests: { customer_metadata: Record<string, unknown> }
  session_data: Record<string, unknown>
}

export interface PaymentProcessorError {
  error: string
  code: number
  details: any
}
