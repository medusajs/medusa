export enum Entities {
  tax_rate = "tax_rate",
}

export const defaults = [
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
  "*tax_region",
  "*rules",
]

export const retrieveTransformQueryConfig = {
  defaults,
  isList: false,
  entity: Entities.tax_rate,
}

export const listTransformQueryConfig = {
  defaults,
  isList: true,
  entity: Entities.tax_rate,
}
