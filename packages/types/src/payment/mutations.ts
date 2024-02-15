import { PaymentCollectionStatus } from "./common"
import { PaymentProviderContext } from "./provider"

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

  payment_session_id: string
  payment_collection_id: string

  cart_id?: string
  order_id?: string
  order_edit_id?: string
  customer_id?: string
}

export interface UpdatePaymentDTO {
  id: string

  cart_id?: string
  order_id?: string
  order_edit_id?: string
  customer_id?: string
}

export interface CreateCaptureDTO {
  amount: number
  payment_id: string

  captured_by?: string
}

export interface CreateRefundDTO {
  amount: number
  payment_id: string

  created_by?: string
}

/**
 * Payment Session
 */

export interface CreatePaymentSessionDTO {
  provider_id: string
  providerContext: PaymentProviderContext
}

export interface UpdatePaymentSessionDTO {
  id: string
  providerContext: PaymentProviderContext
}

/**
 * Payment Provider
 */
export interface CreatePaymentProviderDTO {
  id: string
  is_enabled?: boolean
}

/**
 * Webhook
 */
export interface ProviderWebhookPayload {
  provider: string
  payload: {
    data: string | Buffer | Record<string, unknown>
    headers: Record<string, unknown>
  }
}
