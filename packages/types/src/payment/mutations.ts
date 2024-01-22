import { PaymentCollectionStatus } from "./common"

/**
 * Payment Collection
 */
export interface CreatePaymentCollectionDTO {
  region_id: string
  currency_code: string
  amount: number

  metadata?: Record<string, unknown>
}

export interface UpdatePaymentCollectionDTO
  extends Partial<CreatePaymentCollectionDTO> {
  id: string

  authorized_amount?: number
  refunded_amount?: number
  completed_at?: number
  status?: PaymentCollectionStatus
}

/**
 * Payment
 */

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

/**
 * Payment Session
 */

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
