import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/* ********** PAYMENT COLLECTION ********** */

/**
 * @enum
 *
 * The payment collection's status.
 */
export enum PaymentCollectionStatus {
  /**
   * The payment collection isn't paid.
   */
  NOT_PAID = "not_paid",
  /**
   * The payment collection is awaiting payment.
   */
  AWAITING = "awaiting",
  /**
   * The payment collection is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * Some of the payments in the payment collection are authorized.
   */
  PARTIALLY_AUTHORIZED = "partially_authorized",
  /**
   * The payment collection is canceled.
   */
  CANCELED = "canceled",
}

/**
 * @enum
 *
 * The status of a payment session.
 */
export enum PaymentSessionStatus {
  /**
   * The payment is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * The payment is pending.
   */
  PENDING = "pending",
  /**
   * The payment requires an action.
   */
  REQUIRES_MORE = "requires_more",
  /**
   * An error occurred while processing the payment.
   */
  ERROR = "error",
  /**
   * The payment is canceled.
   */
  CANCELED = "canceled",
}

export interface PaymentCollectionDTO {
  /**
   * The ID of the Payment Collection
   */
  id: string

  /**
   * The currency of the payments/sessions associated with payment collection
   */
  currency_code: string
  /**
   * The id of the region
   */
  region_id: string

  /**
   * The amount
   */
  amount: number

  /**
   * The amount authorized within associated payment sessions
   */
  authorized_amount?: number

  /**
   * The amount refunded from associated payments
   */
  refunded_amount?: number

  /**
   * When the payment collection was completed
   */
  completed_at?: string | Date

  /**
   * When the payment collection was created
   */
  created_at?: string | Date

  /**
   * When the payment collection was updated
   */
  updated_at?: string | Date

  /**
   * Holds custom data in key-value pairs
   */
  metadata?: Record<string, unknown> | null

  /**
   * The status of the payment collection
   */
  status: PaymentCollectionStatus

  /**
   * The payment provider for the payments
   *
   * @expandable
   */
  payment_providers: PaymentProviderDTO[]

  /**
   * The associated payment sessions
   *
   * @expandable
   */
  payment_sessions?: PaymentSessionDTO[]

  /**
   * The associated payments
   *
   * @expandable
   */
  payments?: PaymentDTO[]
}

export interface FilterablePaymentCollectionProps
  extends BaseFilterable<PaymentCollectionDTO> {
  id?: string | string[]

  region_id?: string | string[] | OperatorMap<string>

  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

/* ********** PAYMENT ********** */

export interface PaymentDTO {
  /**
   * The ID of the Payment
   */
  id: string

  /**
   * The payment amount
   */
  amount: number

  authorized_amount?: number

  /**
   * Payment currency
   */
  currency_code: string

  /**
   * The ID of payment provider
   */
  provider_id: string

  cart_id?: string
  order_id?: string
  order_edit_id?: string
  customer_id?: string

  /**
   * Payment provider data
   */
  data?: Record<string, unknown>

  /**
   * When the payment collection was created
   */
  created_at?: string | Date

  /**
   * When the payment collection was updated
   */
  updated_at?: string | Date

  /**
   * When the payment was captured
   */
  captured_at?: string | Date

  /**
   * When the payment was canceled
   */
  canceled_at?: string | Date

  /**
   * The sum of the associated captures
   */
  captured_amount?: number

  /**
   * The sum of the associated refunds
   */
  refunded_amount?: number

  /**
   * The associated payment captures
   *
   * @expandable
   */
  captures?: CaptureDTO[]

  /**
   * The associated refunds of the payment
   *
   * @expandable
   */
  refunds?: RefundDTO[]

  /**
   * The payment collection the payment is associated with
   *
   * @expandable
   */
  payment_collection?: PaymentCollectionDTO

  /**
   * The payment session from which the payment is created
   *
   * @expandable
   */
  payment_session?: PaymentSessionDTO
}

export interface CaptureDTO {
  /**
   * The ID of the Capture
   */
  id: string

  /**
   * Captured amount
   */
  amount: number

  created_at: Date

  created_by?: string

  payment: PaymentDTO
}

export interface RefundDTO {
  /**
   * The ID of the Refund
   */
  id: string

  /**
   * Refunded amount
   */
  amount: number

  created_at: Date

  created_by?: string

  payment: PaymentDTO
}

/* ********** PAYMENT ********** */

export interface PaymentSessionDTO {
  /**
   * The ID of the Payment Session
   */
  id: string

  /**
   * The amount
   */
  amount: number

  /**
   * Payment session currency
   */
  currency_code: string

  /**
   * The ID of payment provider
   */
  provider_id: string

  /**
   * Payment provider data
   */
  data: Record<string, unknown>

  /**
   * The status of the payment session
   */
  status: PaymentSessionStatus

  /**
   * When the session was authorized
   */
  authorized_at?: Date

  /**
   * The payment collection the session is associated with
   * @expandable
   */
  payment_collection?: PaymentCollectionDTO

  /**
   * The payment created from the session
   * @expandable
   */
  payment?: PaymentDTO
}

export interface PaymentProviderDTO {
  id: string
  is_enabled: string
}
