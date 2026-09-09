import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultPaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "*payment_sessions",
]

export const retrievePaymentCollectionTransformQueryConfig = {
  defaults: defaultPaymentCollectionFields,
  allowed: buildAllowedFields(defaultPaymentCollectionFields),
  isList: false,
}
