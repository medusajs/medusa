const internalOperationsFields = [
  "stock_locations",
  "publishable_api_keys",
  "price_set",
  "campaign",
]

export const disallowedStoreFields = [/_link$/, ...internalOperationsFields]
