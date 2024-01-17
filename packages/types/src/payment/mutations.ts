/**
 * TODO
 */

export interface CreatePaymentCollectionDTO {
  region_id: string
  currency_code: string
  amount: number
}

export interface UpdatePaymentCollectionDTO
  extends CreatePaymentCollectionDTO {}

export interface CreatePaymentDTO {
  amount: number
  currency_code: string
  provider_id: string
  data: Record<string, unknown>

  cart_id?: string
  order_id?: string
  order_edit_id?: string
  customer_id?: string
}

export interface UpdatePaymentDTO {
  cart_id?: string
  order_id?: string
  order_edit_id?: string
  customer_id?: string
}

export interface CreatePaymentSessionDTO {
  amount: number
  currency_code: string
  provider_id: string

  cart_id?: string
  resource_id?: string
  customer_id?: string
}

export interface SetPaymentSessionsDTO {
  provider_id: string
  amount: number
  session_id?: string
}
