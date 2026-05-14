export enum Entities {
  region = "region",
}

export const defaultAdminRegionFields = [
  "id",
  "name",
  "currency_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "automatic_taxes",
  "metadata",
  "*countries",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRegionFields,
  isList: false,
  entity: Entities.region,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminRegionFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.region,
}
