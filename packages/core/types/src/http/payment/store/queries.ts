import {
  BasePaymentCollectionFilters,
  BasePaymentSessionFilters,
} from "../common"

export interface StorePaymentCollectionFilters
  extends BasePaymentCollectionFilters {
  fields?: string
}
export interface StorePaymentSessionFilters extends BasePaymentSessionFilters {}
