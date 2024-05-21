import {
  BasePaymentCollection,
  BasePaymentCollectionFilters,
  BasePaymentProvider,
  BasePaymentProviderFilters,
  BasePaymentSession,
  BasePaymentSessionFilters,
} from "./common"

export interface StorePaymentProvider extends BasePaymentProvider {}
export interface StorePaymentCollection extends BasePaymentCollection {}
export interface StorePaymentSession extends BasePaymentSession {}

export interface StorePaymentProviderFilters
  extends BasePaymentProviderFilters {}
export interface StorePaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface StorePaymentSessionFilters extends BasePaymentSessionFilters {}
