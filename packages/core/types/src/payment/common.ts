import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { BigNumberValue } from "../totals"
import { PaymentProviderContext } from "./provider"
/* ********** PAYMENT COLLECTION ********** */

export type PaymentCollectionStatus =
  | "not_paid"
  | "awaiting"
  | "authorized"
  | "partially_authorized"
  | "partially_captured"
  | "canceled"
  | "failed"
  | "completed"

export type PaymentSessionStatus =
  | "authorized"
  | "captured"
  | "pending"
  | "requires_more"
  | "error"
  | "canceled"
  | "pending_authorization"

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

/**
 * The filters to apply on the retrieved payment sessions.
 */
export interface FilterablePaymentMethodProps {
  /**
   * Filter the payment methods by provider.
   */
  provider_id: string

  /**
   * Filter the payment methods by the context of their associated payment provider.
   */
  context: PaymentProviderContext
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
   * The raw amount of the payment.
   */
  raw_amount?: BigNumberValue

  /**
   * The authorized amount of the payment.
   */
  authorized_amount?: BigNumberValue

  /**
   * The raw authorized amount of the payment.
   */
  raw_authorized_amount?: BigNumberValue

  /**
   * The ISO 3 character currency code of the payment.
   */
  currency_code: string

  /**
   * The ID of the associated payment provider.
   */
  provider_id: string

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
   * The sum of the associated captures' raw amounts.
   */
  raw_captured_amount?: BigNumberValue

  /**
   * The sum of the associated refunds' amounts.
   */
  refunded_amount?: BigNumberValue

  /**
   * The sum of the associated refunds' raw amounts.
   */
  raw_refunded_amount?: BigNumberValue

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
   * The ID of the associated payment collection.
   */
  payment_collection_id: string

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
   * Find payments based on different fields.
   */
  q?: string

  /**
   * The IDs to filter the payments by.
   */
  id?: string | string[]

  /**
   * Filter the payments by the ID of their associated payment session.
   */
  payment_session_id?: string | string[] | OperatorMap<string>

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
   * The raw captured amount.
   */
  raw_amount?: BigNumberValue

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
   * The raw refunded amount.
   */
  raw_amount?: BigNumberValue

  /**
   * The id of the refund_reason that is associated with the refund
   */
  refund_reason_id?: string | null

  /**
   * The id of the refund_reason that is associated with the refund
   */
  refund_reason?: RefundReasonDTO | null

  /**
   * A field to add some additional information about the refund
   */
  note?: string | null

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
   * When the payment session was created
   */
  created_at: Date | string

  /**
   * When the payment session was updated
   */
  updated_at: Date | string

  /**
   * The ID of the associated payment collection.
   */
  payment_collection_id: string

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

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
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
  is_enabled: boolean
}

/**
 * The filters to apply on the retrieved payment providers.
 */
export interface FilterablePaymentProviderProps
  extends BaseFilterable<PaymentProviderDTO> {
  /**
   * The IDs to filter the payment provider by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter by whether the payment provider is enabled.
   */
  is_enabled?: boolean
}

export interface FilterableRefundReasonProps
  extends BaseFilterable<FilterableRefundReasonProps> {
  /**
   * The IDs to filter the refund reasons by.
   */
  id?: string | string[]

  /**
   * Filter by the description of the refund reason
   */
  description?: string | string[]

  /**
   * Filter by the refund reason label
   */
  label?: string | string[]
}

export interface RefundReasonDTO {
  /**
   * The ID of the refund reason
   */
  id: string
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
  metadata: Record<string, unknown> | null
  /**
   * When the refund reason was created
   */
  created_at: Date | string
  /**
   * When the refund reason was updated
   */
  updated_at: Date | string
}

export interface PaymentMethodDTO {
  /**
   * The ID of the payment method.
   */
  id: string

  /**
   * The data of the payment method, as returned by the payment provider.
   */
  data: Record<string, unknown>

  /**
   * The ID of the associated payment provider.
   */
  provider_id: string
}

export interface AccountHolderDTO {
  /**
   * The ID of the account holder.
   */
  id: string

  /**
   * The ID of the associated payment provider.
   */
  provider_id: string

  /**
   * The external ID of the account holder in the payment provider system.
   */
  external_id: string

  /**
   * The email of the account holder.
   */
  email: string | null

  /**
   * The data of the account holder, as returned by the payment provider.
   */
  data: Record<string, unknown>

  /**
   * When the account holder was created.
   */
  created_at?: string | Date | null

  /**
   * When the account holder was updated.
   */
  updated_at?: string | Date | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}
