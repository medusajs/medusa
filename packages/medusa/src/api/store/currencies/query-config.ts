import { buildAllowedFields } from "../utils/allowed-fields"

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
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
}
