export const adminPricePreferenceRemoteQueryFields = [
  "id",
  "attribute",
  "value",
  "is_tax_inclusive",
  "created_at",
  "deleted_at",
  "updated_at",
]

export const retrivePricePreferenceQueryConfig = {
  defaults: adminPricePreferenceRemoteQueryFields,
  isList: false,
}

export const listPricePreferenceQueryConfig = {
  ...retrivePricePreferenceQueryConfig,
  isList: true,
}
