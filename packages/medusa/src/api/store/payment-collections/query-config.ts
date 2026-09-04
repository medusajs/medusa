import { disallowedStorePivotFields } from "../utils/disallowed-fields"

export const defaultPaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "*payment_sessions",
]

export const retrievePaymentCollectionTransformQueryConfig = {
  defaults: defaultPaymentCollectionFields,
  disallowed: disallowedStorePivotFields,
  isList: false,
}
