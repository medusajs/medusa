export enum Entities {
  basic_material = "basic_material",
}

export const defaultAdminBasicMaterialFields = [
  "id",
  "material_code",
  "material_name",
  "spu_code",
  "material_type",
  "category_id",
  "sn_managed",
  "stock_controlled",
  "tax_rate",
  "tax_name",
  "tax_code",
  "omnichannel",
  "o2o_enabled",
  "color",
  "size",
  "source",
  "org_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminBasicMaterialRelations = []

export const allowedAdminBasicMaterialRelations = []

export const allowedAdminBasicMaterialFields = defaultAdminBasicMaterialFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminBasicMaterialFields,
  isList: false,
  entity: Entities.basic_material,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.basic_material,
}
