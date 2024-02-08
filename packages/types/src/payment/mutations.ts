import { PaymentCollectionStatus } from "./common"

/**
 * Payment Collection
 */
export interface CreatePaymentCollectionDTO {
  /**
   * The associated region's ID.
   */
  region_id: string

  /**
   * The currency code of the payment collection.
   */
  currency_code: string

  /**
   * The amount of the payment collection.
   */
  amount: number

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * The attributes to update in the payment collection.
 */
export interface UpdatePaymentCollectionDTO
  extends Partial<CreatePaymentCollectionDTO> {
  /**
   * The ID of the payment collection.
   */
  id: string

  /**
   * The authorized amount of the payment collection.
   */
  authorized_amount?: number

  /**
   * The refunded amount of the payment collection.
   */
  refunded_amount?: number

  /**
   * The status of the payment collection.
   */
  status?: PaymentCollectionStatus
}

/**
 * Payment
 */
export interface CreatePaymentDTO {
  /**
   * The amount of the payment.
   */
  amount: number

  /**
   * The currency code of the payment.
   */
  currency_code: string

  /**
   * The associated provider's ID.
   */
  provider_id: string

  /**
   * The data of the payment.
   */
  data: Record<string, unknown>

  /**
   * The associated payment session's ID.
   */
  payment_session_id: string

  /**
   * The associated payment collection's ID.
   */
  payment_collection_id: string

  /**
   * The associated cart's ID.
   */
  cart_id?: string

  /**
   * The associated order's ID.
   */
  order_id?: string

  /**
   * The associated order edit's ID.
   */
  order_edit_id?: string

  /**
   * The associated customer's ID.
   */
  customer_id?: string
}

/**
 * The attributes to update in the payment.
 */
export interface UpdatePaymentDTO {
  /**
   * The ID of the payment.
   */
  id: string

  /**
   * The associated cart's ID.
   */
  cart_id?: string

  /**
   * The associated order's ID.
   */
  order_id?: string

  /**
   * The associated order edit's ID.
   */
  order_edit_id?: string

  /**
   * The associated customer's ID.
   */
  customer_id?: string

  /**
   * The data of the payment.
   */
  data?: Record<string, unknown>
}

/**
 * The capture to be created.
 */
export interface CreateCaptureDTO {
  /**
   * The amount of the capture.
   */
  amount: number

  /**
   * The associated payment's ID.
   */
  payment_id: string

  /**
   * The captured by of the capture.
   */
  captured_by?: string
}

/**
 * The refund to be created.
 */
export interface CreateRefundDTO {
  /**
   * The amount of the refund.
   */
  amount: number

  /**
   * The associated payment's ID.
   */
  payment_id: string

  /**
   * The created by of the refund.
   */
  created_by?: string
}

/**
 * Payment Session
 */
export interface CreatePaymentSessionDTO {
  /**
   * The amount of the payment session.
   */
  amount: number

  /**
   * The currency code of the payment session.
   */
  currency_code: string

  /**
   * The associated provider's ID.
   */
  provider_id: string

  /**
   * The associated cart's ID.
   */
  cart_id?: string

  /**
   * The associated resource's ID.
   */
  resource_id?: string

  /**
   * The associated customer's ID.
   */
  customer_id?: string
}

/**
 * The details to set a payment session.
 */
export interface SetPaymentSessionsDTO {
  /**
   * The associated provider's ID.
   */
  provider_id: string

  /**
   * The amount of the set payment sessions.
   */
  amount: number

  /**
   * The associated session's ID.
   */
  session_id?: string
}
