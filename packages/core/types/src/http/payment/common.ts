import { BaseFilterable, OperatorMap } from "../../dal"
import { BigNumberValue } from "../../totals"

/**
 * The payment collection's status.
 */
export type BasePaymentCollectionStatus =
  | "not_paid"
  | "awaiting"
  | "authorized"
  | "partially_authorized"
  | "canceled"

/**
 *
 * The status of a payment session.
 */
export type BasePaymentSessionStatus =
  | "authorized"
  | "pending"
  | "requires_more"
  | "error"
  | "canceled"

export interface BasePaymentProvider {
  id: string
}

/**
 * The payment collection details.
 */
export interface BasePaymentCollection {
  /**
   * The ID of the payment collection.
   */
  id: string

  /**
   * The ISO 3 character currency code of the payment sessions and payments associated with payment collection.
   */
  currency_code: string

  /**
   * The id of the associated region.
   */
  region_id: string

  /**
   * The total amount to be authorized and captured.
   */
  amount: BigNumberValue

  /**
   * The amount authorized within the associated payment sessions.
   */
  authorized_amount?: BigNumberValue

  /**
   * The amount refunded within the associated payments.
   */
  refunded_amount?: BigNumberValue

  /**
   * When the payment collection was completed.
   */
  completed_at?: string | Date

  /**
   * When the payment collection was created.
   */
  created_at?: string | Date

  /**
   * When the payment collection was updated.
   */
  updated_at?: string | Date

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The status of the payment collection.
   */
  status: BasePaymentCollectionStatus

  /**
   * The payment provider used to process the associated payment sessions and payments.
   *
   * @expandable
   */
  payment_providers: BasePaymentProvider[]

  /**
   * The associated payment sessions.
   *
   * @expandable
   */
  payment_sessions?: BasePaymentSession[]

  /**
   * The associated payments.
   *
   * @expandable
   */
  payments?: BasePayment[]
}

export interface BasePayment {
  /**
   * The ID of the payment.
   */
  id: string

  /**
   * The payment's total amount.
   */
  amount: BigNumberValue

  /**
   * The authorized amount of the payment.
   */
  authorized_amount?: BigNumberValue

  /**
   * The ISO 3 character currency code of the payment.
   */
  currency_code: string

  /**
   * The ID of the associated payment provider.
   */
  provider_id: string

  /**
   * The ID of the associated cart.
   */
  cart_id?: string

  /**
   * The ID of the associated order.
   */
  order_id?: string

  /**
   * The ID of the associated order edit.
   */
  order_edit_id?: string

  /**
   * The ID of the associated customer.
   */
  customer_id?: string

  /**
   * The data relevant for the payment provider to process the payment.
   */
  data?: Record<string, unknown>

  /**
   * When the payment was created.
   */
  created_at?: string | Date

  /**
   * When the payment was updated.
   */
  updated_at?: string | Date

  /**
   * When the payment was captured.
   */
  captured_at?: string | Date

  /**
   * When the payment was canceled.
   */
  canceled_at?: string | Date

  /**
   * The sum of the associated captures' amounts.
   */
  captured_amount?: BigNumberValue

  /**
   * The sum of the associated refunds' amounts.
   */
  refunded_amount?: BigNumberValue

  /**
   * The associated captures.
   *
   * @expandable
   */
  captures?: BaseCapture[]

  /**
   * The associated refunds.
   *
   * @expandable
   */
  refunds?: BaseRefund[]

  /**
   * The associated payment collection.
   *
   * @expandable
   */
  payment_collection?: BasePaymentCollection

  /**
   * The payment session from which the payment is created.
   *
   * @expandable
   */
  payment_session?: BasePaymentSession
}

/**
 * The capture details.
 */
export interface BaseCapture {
  /**
   * The ID of the capture.
   */
  id: string

  /**
   * The captured amount.
   */
  amount: BigNumberValue

  /**
   * The creation date of the capture.
   */
  created_at: Date

  /**
   * Who the capture was created by. For example,
   * the ID of a user.
   */
  created_by?: string

  /**
   * The associated payment.
   */
  payment: BasePayment
}

/**
 * The refund details.
 */
export interface BaseRefund {
  /**
   * The ID of the refund
   */
  id: string

  /**
   * The refunded amount.
   */
  amount: BigNumberValue

  /**
   * The creation date of the refund.
   */
  created_at: Date

  /**
   * Who created the refund. For example,
   * the user's ID.
   */
  created_by?: string

  /**
   * The associated payment.
   */
  payment: BasePayment
}

/**
 * The payment session details.
 */
export interface BasePaymentSession {
  /**
   * The ID of the payment session.
   */
  id: string

  /**
   * The amount to authorize.
   */
  amount: BigNumberValue

  /**
   * The 3 character currency code of the payment session.
   */
  currency_code: string

  /**
   * The ID of the associated payment provider.
   */
  provider_id: string

  /**
   * The data necessary for the payment provider to process the payment session.
   */
  data: Record<string, unknown>

  /**
   * The context necessary for the payment provider.
   */
  context?: Record<string, unknown>

  /**
   * The status of the payment session.
   */
  status: BasePaymentSessionStatus

  /**
   * When the payment session was authorized.
   */
  authorized_at?: Date

  /**
   * The payment collection the session is associated with.
   *
   * @expandable
   */
  payment_collection?: BasePaymentCollection

  /**
   * The payment created from the session.
   *
   * @expandable
   */
  payment?: BasePayment
}

/**
 * The filters to apply on the retrieved payment collection.
 */
export interface BasePaymentCollectionFilters
  extends BaseFilterable<BasePaymentCollectionFilters> {
  /**
   * The IDs to filter the payment collection by.
   */
  id?: string | string[]

  /**
   * Filter by associated region's ID.
   */
  region_id?: string | string[] | OperatorMap<string>

  /**
   * Filter payment collections by created date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter payment collections by updated date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved payment sessions.
 */
export interface BasePaymentSessionFilters
  extends BaseFilterable<BasePaymentSessionFilters> {
  /**
   * The IDs to filter the payment sessions by.
   */
  id?: string | string[]

  /**
   * Filter the payment sessions by their currency code.
   */
  currency_code?: string | string[]

  /**
   * Filter the payment sessions by their amount.
   */
  amount?: BigNumberValue | OperatorMap<BigNumberValue>

  /**
   * Filter the payment sessions by the ID of their associated payment provider.
   */
  provider_id?: string | string[]

  /**
   * Filter the payment sessions by the ID of their associated payment collection.
   */
  payment_collection_id?: string | string[]

  /**
   * Filter the payment sessions by the ID of their associated region.
   */
  region_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the payment sessions by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the payment sessions by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the payment sessions by their deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface BasePaymentProviderFilters
  extends BaseFilterable<BasePaymentProviderFilters> {
  id?: string | string[]
  region_id?: string | string[]
}
