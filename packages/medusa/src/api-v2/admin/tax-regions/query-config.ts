export const defaultAdminTaxRegionRelations = []
export const allowedAdminTaxRegionRelations = []
export const defaultAdminTaxRegionFields = [
  "id",
  "name",
  "code",
  "rate",
  "tax_region_id",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminTaxRegionFields,
  defaultRelations: defaultAdminTaxRegionRelations,
  allowedRelations: allowedAdminTaxRegionRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 20,
  isList: true,
}
