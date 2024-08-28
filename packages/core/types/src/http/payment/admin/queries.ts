import { BaseFilterable } from "../../../dal"
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

export interface AdminPaymentFilters extends BasePaymentFilters {}

export interface RefundFilters extends BaseFilterable<AdminRefund> {
  id?: string | string[]
}
export interface RefundReasonFilters extends BaseFilterable<AdminRefundReason> {
  id?: string | string[]
}

export interface AdminGetPaymentProvidersParams
  extends FindParams,
    BaseFilterable<AdminGetPaymentProvidersParams> {
  id?: string | string[]
  is_enabled?: boolean
  $and?: AdminGetPaymentProvidersParams[]
  $or?: AdminGetPaymentProvidersParams[]
}
