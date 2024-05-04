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
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
}
