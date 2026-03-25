export enum Entities {
  price_preference = "price_preference",
}

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
  entity: Entities.price_preference,
}

export const listPricePreferenceQueryConfig = {
  ...retrivePricePreferenceQueryConfig,
  isList: true,
  entity: Entities.price_preference,
}
