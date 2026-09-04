import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultStoreCurrencyFields = [
  "code",
  "name",
  "symbol",
  "symbol_native",
  "decimal_digits",
  "rounding",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreCurrencyFields,
  allowed: buildAllowedFields(defaultStoreCurrencyFields),
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
}
