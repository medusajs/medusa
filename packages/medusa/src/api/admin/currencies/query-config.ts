export enum Entities {
  currency = "currency",
}

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
  entity: Entities.currency,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 200,
  isList: true,
  entity: Entities.currency,
}
