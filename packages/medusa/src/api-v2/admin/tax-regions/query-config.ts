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
  "tax_rates.rate",
  "tax_rates.code",
  "tax_rates.name",
  "tax_rates.is_default",
  "tax_rates.is_combinable",
  "tax_rates.created_at",
  "tax_rates.updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
