import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"
import {
  BasePaymentCollectionFilters,
  BasePaymentFilters,
  BasePaymentSessionFilters,
} from "../common"
import { AdminRefundReason } from "./entities"

export interface AdminPaymentProviderFilters
  extends FindParams,
    BaseFilterable<AdminPaymentProviderFilters> {
  id: string | string[]
  is_enabled?: boolean
}
export interface AdminPaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface AdminPaymentSessionFilters extends BasePaymentSessionFilters {}

export interface AdminPaymentFilters extends FindParams, BasePaymentFilters {
  /**
   * Query or keywords to search the payment's searchable fields.
   */
  q?: string
  /**
   * Filter by IDs of associated payment sessions to retrieve their payments.
   */
  payment_session_id?: string | string[]
  /**
   * Apply filters on the payment's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the payment's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the payment's deleted date.
   */
  deleted_at?: OperatorMap<string>
}

export interface RefundReasonFilters
  extends FindParams,
    BaseFilterable<AdminRefundReason> {
  id?: string | string[]
  q?: string
}

export interface AdminGetPaymentProvidersParams
  extends FindParams,
    BaseFilterable<AdminGetPaymentProvidersParams> {
  /**
   * Filter by payment provider ID(s).
   */
  id?: string | string[]
  /**
   * Whether the payment provider is enabled.
   */
  is_enabled?: boolean
}
