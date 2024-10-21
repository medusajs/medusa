import {
  BasePaymentCollectionFilters,
  BasePaymentSessionFilters,
} from "../common"

export interface StorePaymentProviderFilters {
  /**
   * The ID of the region to retrieve its payment providers.
   */
  region_id: string
}
export interface StorePaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface StorePaymentSessionFilters extends BasePaymentSessionFilters {}
