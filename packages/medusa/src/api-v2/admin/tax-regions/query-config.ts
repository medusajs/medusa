export const defaults = [
  "id",
  "country_code",
  "province_code",
  "parent_id",
  "provider_id",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "tax_rates.id",
]

export const retrieveTransformQueryConfig = {
  defaults,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
