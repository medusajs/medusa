import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"
import {
  BasePaymentCollectionFilters,
  BasePaymentFilters,
  BasePaymentProviderFilters,
  BasePaymentSessionFilters,
} from "../common"
import { AdminRefund, AdminRefundReason } from "./entities"

export interface AdminPaymentProviderFilters
  extends BasePaymentProviderFilters {
  is_enabled?: boolean
}
export interface AdminPaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface AdminPaymentSessionFilters extends BasePaymentSessionFilters {}

export interface AdminPaymentFilters extends FindParams, BasePaymentFilters {
  q?: string
  payment_session_id?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface RefundReasonFilters extends FindParams, BaseFilterable<AdminRefundReason> {
  id?: string | string[]
  q?: string
}

export interface AdminGetPaymentProvidersParams
  extends FindParams,
    BaseFilterable<AdminGetPaymentProvidersParams> {
  id?: string | string[]
  is_enabled?: boolean
  $and?: AdminGetPaymentProvidersParams[]
  $or?: AdminGetPaymentProvidersParams[]
}
