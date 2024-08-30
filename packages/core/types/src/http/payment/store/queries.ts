import {
  BasePaymentCollectionFilters,
  BasePaymentProviderFilters,
  BasePaymentSessionFilters,
} from "../common"

export interface StorePaymentProviderFilters
  extends BasePaymentProviderFilters {
    is_enabled?: boolean
  }
export interface StorePaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface StorePaymentSessionFilters extends BasePaymentSessionFilters {}
