/**
 * TODO
 */

export interface CreatePaymentCollectionDTO {}

export interface UpdatePaymentCollectionDTO {}

export interface CreatePaymentDTO {
  amount: number
  currency_code: string
  provider_id: string
  data: Record<string, unknown>

  cart_id?: string
  order_id?: string
  customer_id?: string
}

export interface UpdatePaymentDTO {
  cart_id?: string
  order_id?: string
  customer_id?: string
}
