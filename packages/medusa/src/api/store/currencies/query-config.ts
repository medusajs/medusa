import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultStoreCurrencyFields = [
  "code",
  "name",
  "symbol",
  "symbol_native",
  "decimal_digits",
  "rounding",
]

const additionalStoreCurrencyFields = ["created_at", "updated_at", "deleted_at"]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreCurrencyFields,
  allowed: buildAllowedFields(
    defaultStoreCurrencyFields,
    additionalStoreCurrencyFields
  ),
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
}
