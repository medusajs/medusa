import {
  Cart,
  Customer,
  PaymentCollection,
  PaymentCollectionType,
  PaymentSession,
} from "../models"

export type CreatePaymentCollectionInput = {
  region_id: string
  type: PaymentCollectionType
  currency_code: string
  amount: number
  created_by: string
  metadata?: any
  description?: string
}

export type PaymentCollectionSessionInput = {
  provider_id: string
  amount: number
  session_id?: string
  customer_id: string
}

export type PaymentProviderDataInput = {
  resource_id: string
  customer: Partial<Customer>
  currency_code: string
  provider_id: string
  amount: number
  payment_session?: PaymentSession
  payment_description?: string
  cart_id?: string
  cart?: Cart
  metadata?: any
}
export const defaultPaymentCollectionRelations = [
  "region",
  "region.payment_providers",
  "payment_sessions",
]

export const defaultPaymentCollectionFields: (keyof PaymentCollection)[] = [
  "id",
  "type",
  "status",
  "description",
  "amount",
  "authorized_amount",
  "refunded_amount",
  "currency_code",
  "metadata",
  "region",
  "payment_sessions",
  "payments",
]

// eslint-disable-next-line max-len
export const storePaymentCollectionNotAllowedFieldsAndRelations = ["created_by"]

export const defaultStorePaymentCollectionRelations =
  defaultPaymentCollectionRelations.filter(
    (field) =>
      !storePaymentCollectionNotAllowedFieldsAndRelations.includes(field)
  )
export const defaultStorePaymentCollectionFields =
  defaultPaymentCollectionFields.filter(
    (field) =>
      !storePaymentCollectionNotAllowedFieldsAndRelations.includes(field)
  )
