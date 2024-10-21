import {
  BasePaymentCollection,
  BasePaymentProvider,
  BasePaymentSession,
} from "../common"

export interface StorePaymentProvider extends BasePaymentProvider {}
export interface StorePaymentCollection extends BasePaymentCollection {
  /**
   * The payment collection's sessions.
   */
  payment_sessions?: StorePaymentSession[]
  /**
   * The providers used for the payment collection's sessions.
   */
  payment_providers: StorePaymentProvider[]
}
export interface StorePaymentSession extends BasePaymentSession {
  /**
   * The payment collection that the session belongs to.
   */
  payment_collection?: StorePaymentCollection
}
