export const defaultAdminCurrencyFields = [
  "code",
  "name",
  "symbol",
  "symbol_native",
  "decimal_digits",
  "rounding",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCurrencyFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
}
