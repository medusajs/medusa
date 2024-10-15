import {
  BasePaymentCollection,
  BasePaymentProvider,
  BasePaymentSession,
} from "../common"

export interface StorePaymentProvider extends BasePaymentProvider {}
export interface StorePaymentCollection extends BasePaymentCollection {
  payment_sessions?: StorePaymentSession[]
  payment_providers: StorePaymentProvider[]
}
export interface StorePaymentSession extends BasePaymentSession {
  payment_collection?: StorePaymentCollection
}
