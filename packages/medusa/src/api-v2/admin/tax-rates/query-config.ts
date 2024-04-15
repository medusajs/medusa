export const defaultAdminTaxRateRelations = []
export const allowedAdminTaxRateRelations = []
export const defaultAdminTaxRateFields = [
  "id",
  "name",
  "code",
  "rate",
  "tax_region_id",
  "is_default",
  "is_combinable",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminTaxRateFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminTaxRateFields,
  isList: true,
}
