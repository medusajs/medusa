import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultPaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "*payment_sessions",
]

export const allowedStorePaymentCollectionExtraFields = [
  "status",
  "payment_providers",
  "payment_providers.id",
  "payment_sessions.id",
  "payment_sessions.amount",
  "payment_sessions.currency_code",
  "payment_sessions.provider_id",
  "payment_sessions.data",
  "payment_sessions.status",
]

export const retrievePaymentCollectionTransformQueryConfig = {
  defaults: defaultPaymentCollectionFields,
  allowed: buildAllowedFields(
    defaultPaymentCollectionFields,
    allowedStorePaymentCollectionExtraFields
  ),
  isList: false,
}
