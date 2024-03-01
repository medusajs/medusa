export const defaultAdminCurrencyRelations = []
export const allowedAdminCurrencyRelations = []
export const defaultAdminCurrencyFields = [
  "code",
  "name",
  "symbol",
  "symbol_native",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminCurrencyFields,
  defaultRelations: defaultAdminCurrencyRelations,
  allowedRelations: allowedAdminCurrencyRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 50,
  isList: true,
}
