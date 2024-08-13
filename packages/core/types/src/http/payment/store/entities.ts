import {
  BasePaymentCollection,
  BasePaymentProvider,
  BasePaymentSession,
} from "../common"

export interface StorePaymentProvider extends BasePaymentProvider {}
export interface StorePaymentCollection extends BasePaymentCollection {}
export interface StorePaymentSession extends BasePaymentSession {}