import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { BigNumberValue } from "../totals"
/* ********** PAYMENT COLLECTION ********** */

export type PaymentCollectionStatus =
  | "not_paid"
  | "awaiting"
  | "authorized"
  | "partially_authorized"
  | "canceled"

export type PaymentSessionStatus =
  | "authorized"
  | "captured"
  | "pending"
  | "requires_more"
  | "error"
  | "canceled"

/**
 * The payment collection details.
 */
export interface PaymentCollectionDTO {
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
   * The amount captured within the associated payments.
   */
  captured_amount?: BigNumberValue

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
  status: PaymentCollectionStatus

  /**
   * The payment provider used to process the associated payment sessions and payments.
   *
   * @expandable
   */
  payment_providers: PaymentProviderDTO[]

  /**
   * The associated payment sessions.
   *
   * @expandable
   */
  payment_sessions?: PaymentSessionDTO[]

  /**
   * The associated payments.
   *
   * @expandable
   */
  payments?: PaymentDTO[]
}

/**
 * The filters to apply on the retrieved payment collection.
 */
export interface FilterablePaymentCollectionProps
  extends BaseFilterable<PaymentCollectionDTO> {
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
export interface FilterablePaymentSessionProps
  extends BaseFilterable<PaymentSessionDTO> {
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

/**
 * The filters to apply on the retrieved captures.
 */
export interface FilterableCaptureProps extends BaseFilterable<CaptureDTO> {
  /**
   * The IDs to filter the captures by.
   */
  id?: string | string[]

  /**
   * Filter the captures by their currency code.
   */
  currency_code?: string | string[]

  /**
   * Filter the captures by their amounts.
   */
  amount?: BigNumberValue | OperatorMap<BigNumberValue>

  /**
   * Filter the captures by the ID of their associated payment.
   */
  payment_id?: string | string[]

  /**
   * Filter the captures by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the captures by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the captures by their deletion date.
   */
  deleted_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved refunds.
 */
export interface FilterableRefundProps extends BaseFilterable<RefundDTO> {
  /**
   * The IDs to filter the refunds by.
   */
  id?: string | string[]

  /**
   * Filter the refunds by their currency code.
   */
  currency_code?: string | string[]

  /**
   * Filter the refunds by their amount.
   */
  amount?: BigNumberValue | OperatorMap<BigNumberValue>

  /**
   * Filter the refunds by the ID of their associated payment.
   */
  payment_id?: string | string[]

  /**
   * Filter the refunds by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the refunds by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the refunds by their deletion date.
   */
  deleted_at?: OperatorMap<string>
}
/* ********** PAYMENT ********** */
export interface PaymentDTO {
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
  captures?: CaptureDTO[]

  /**
   * The associated refunds.
   *
   * @expandable
   */
  refunds?: RefundDTO[]

  /**
   * The associated payment collection.
   *
   * @expandable
   */
  payment_collection?: PaymentCollectionDTO

  /**
   * The payment session from which the payment is created.
   *
   * @expandable
   */
  payment_session?: PaymentSessionDTO
}

/**
 * The filters to apply on the retrieved payments.
 */
export interface FilterablePaymentProps
  extends BaseFilterable<FilterablePaymentProps> {
  /**
   * Find payments based on cart, order, or customer IDs through this search term.
   */
  q?: string

  /**
   * The IDs to filter the payments by.
   */
  id?: string | string[]

  /**
   * Filter the payments by the ID of their associated payment session.
   */
  session_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the payments by the ID of their associated customer.
   */
  customer_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the payments by the ID of their associated cart.
   */
  cart_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the payments by the ID of their associated order.
   */
  order_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the payments by the ID of their associated order edit.
   */
  order_edit_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the payments by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the payments by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the payments by their capture date.
   */
  captured_at?: OperatorMap<string>

  /**
   * Filter the payments by their cancelation date.
   */
  canceled_at?: OperatorMap<string>
}

/**
 * The capture details.
 */
export interface CaptureDTO {
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
  payment: PaymentDTO
}

/**
 * The refund details.
 */
export interface RefundDTO {
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
  payment: PaymentDTO
}
/* ********** PAYMENT SESSION ********** */
/**
 * The payment session details.
 */
export interface PaymentSessionDTO {
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
  status: PaymentSessionStatus

  /**
   * When the payment session was authorized.
   */
  authorized_at?: Date

  /**
   * The payment collection the session is associated with.
   *
   * @expandable
   */
  payment_collection?: PaymentCollectionDTO

  /**
   * The payment created from the session.
   *
   * @expandable
   */
  payment?: PaymentDTO
}

/**
 * The payment provider details.
 */
export interface PaymentProviderDTO {
  /**
   * The ID of the payment provider.
   */
  id: string

  /**
   * Whether the payment provider is enabled.
   */
  is_enabled: string
}

/**
 * The filters to apply on the retrieved payment providers.
 */
export interface FilterablePaymentProviderProps
  extends BaseFilterable<PaymentProviderDTO> {
  /**
   * The IDs to filter the payment collection by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter by whether the payment provider is enabled.
   */
  is_enabled?: boolean
}
