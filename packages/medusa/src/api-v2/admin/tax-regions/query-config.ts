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
  "*children",
  "*children.tax_rates",
  "*children.tax_rates.rules",
  "*parent",
  "*tax_rates",
  "*tax_rates.rules",
]

export const retrieveTransformQueryConfig = {
  defaults,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
