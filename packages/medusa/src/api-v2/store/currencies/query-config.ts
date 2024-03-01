export const defaultStoreCurrencyRelations = []
export const allowedStoreCurrencyRelations = []
export const defaultStoreCurrencyFields = [
  "code",
  "name",
  "symbol",
  "symbol_native",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultStoreCurrencyFields,
  defaultRelations: defaultStoreCurrencyRelations,
  allowedRelations: allowedStoreCurrencyRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 20,
  isList: true,
}
