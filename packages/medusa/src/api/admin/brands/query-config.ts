export enum Entities {
  brand = "brand",
}

export const defaultAdminBrandFields = [
  "id",
  "name",
  "slug",
  "logo_url",
  "description",
  "org_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminBrandRelations = []

export const allowedAdminBrandRelations = []

export const allowedAdminBrandFields = defaultAdminBrandFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminBrandFields,
  isList: false,
  entity: Entities.brand,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.brand,
}
