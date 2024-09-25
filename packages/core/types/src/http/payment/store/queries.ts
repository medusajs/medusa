import {
  BasePaymentCollectionFilters,
  BasePaymentSessionFilters,
} from "../common"

export interface StorePaymentProviderFilters {
  region_id: string
}
export interface StorePaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface StorePaymentSessionFilters extends BasePaymentSessionFilters {}
