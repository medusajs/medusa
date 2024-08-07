import { BigNumberInput } from "../totals"
import { PaymentProviderContext } from "./provider"

/**
 * The payment collection to be created.
 */
export interface CreatePaymentCollectionDTO {
  /**
   * The associated region's ID.
   */
  region_id: string

  /**
   * The ISO 3 character currency code of the payment collection.
   */
  currency_code: string

  /**
   * The amount of the payment collection.
   */
  amount: BigNumberInput

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
}

/**
 * The attributes in the payment collection to be created or updated.
 */
export interface UpsertPaymentCollectionDTO {
  /**
   * The ID of the payment collection.
   */
  id?: string

  /**
   * The associated region's ID.
   */
  region_id?: string

  /**
   * The ISO 3 character currency code of the payment collection.
   */
  currency_code?: string

  /**
   * The amount of the payment collection.
   */
  amount?: BigNumberInput

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * The attributes to update in the payment collection.
 */
export interface PaymentCollectionUpdatableFields {
  /**
   * The associated region's ID.
   */
  region_id?: string

  /**
   * {The ISO 3 character currency code of the payment collection.
   */
  currency_code?: string

  /**
   * The amount of the payment collection.
   */
  amount?: BigNumberInput

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * The payment to be created.
 */
export interface CreatePaymentDTO {
  /**
   * The amount of the payment.
   */
  amount: BigNumberInput

  /**
   * The ISO 3 character currency code of the payment.
   */
  currency_code: string

  /**
   * The associated provider's ID.
   */
  provider_id: string

  /**
   * The data necessary for the associated payment provider to process the payment.
   */
  data: Record<string, unknown>

  /**
   * The ID of the payment session this payment was created from.
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
}

/**
 * The capture to be created.
 */
export interface CreateCaptureDTO {
  /**
   * The amount of the capture.
   */
  amount?: BigNumberInput

  /**
   * The associated payment's ID.
   */
  payment_id: string

  /**
   * Who captured the payment. For example,
   * a user's ID.
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
  amount?: BigNumberInput

  /**
   * The associated payment's ID.
   */
  payment_id: string

  /**
   * The associated refund reason's ID.
   */
  refund_reason_id?: string | null

  /**
   * A text field that adds some information about the refund
   */
  note?: string

  /**
   * Who refunded the payment. For example,
   * a user's ID.
   */
  created_by?: string
}

/**
 * The payment session to be created.
 */
export interface CreatePaymentSessionDTO {
  /**
   * The provider's ID.
   */
  provider_id: string

  /**
   * The ISO 3 character currency code of the payment session.
   */
  currency_code: string

  /**
   * The amount to be authorized.
   */
  amount: BigNumberInput

  /**
   * Necessary data for the associated payment provider to process the payment.
   */
  data: Record<string, unknown>

  /**
   * Necessary context data for the associated payment provider.
   */
  context?: PaymentProviderContext
}

/**
 * The attributes to update in a payment session.
 */
export interface UpdatePaymentSessionDTO {
  /**
   * The payment session's ID.
   */
  id: string

  /**
   * Necessary data for the associated payment provider to process the payment.
   */
  data: Record<string, unknown>

  /**
   * The ISO 3 character currency code.
   */
  currency_code: string

  /**
   * The amount to be authorized.
   */
  amount: BigNumberInput

  /**
   * Necessary context data for the associated payment provider.
   */
  context?: PaymentProviderContext
}

/**
 * The payment provider to be created.
 */
export interface CreatePaymentProviderDTO {
  /**
   * The provider's ID.
   */
  id: string

  /**
   * Whether the provider is enabled.
   */
  is_enabled?: boolean
}

/**
 * The details of the webhook event payload.
 */
export interface ProviderWebhookPayload {
  /**
   * The ID of the provider to pass the webhook event payload to.
   */
  provider: string

  /**
   * The webhook event payload passed to the specified provider.
   */
  payload: {
    /**
     * The parsed webhook body.
     */
    data: Record<string, unknown>

    /**
     * The raw webhook request body.
     */
    rawData: string | Buffer

    /**
     * The headers of the webhook request.
     */
    headers: Record<string, unknown>
  }
}

export interface CreateRefundReasonDTO {
  /**
   * The label of the refund reason
   */
  label: string
  /**
   * The description of the refund reason
   */
  description?: string | null
  /**
   * The metadata of the refund reason
   */
  metadata?: Record<string, unknown> | null
}

export interface UpdateRefundReasonDTO {
  /**
   * The id of the refund reason
   */
  id: string
  /**
   * The label of the refund reason
   */
  label?: string
  /**
   * The description of the refund reason
   */
  description?: string | null
  /**
   * The metadata of the refund reason
   */
  metadata?: Record<string, unknown> | null
}
