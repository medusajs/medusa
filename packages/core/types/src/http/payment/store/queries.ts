import {
  BasePaymentCollectionFilters,
  BasePaymentProviderFilters,
  BasePaymentSessionFilters,
} from "../common"

export interface StorePaymentProviderFilters
  extends BasePaymentProviderFilters {}
export interface StorePaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface StorePaymentSessionFilters extends BasePaymentSessionFilters {}
