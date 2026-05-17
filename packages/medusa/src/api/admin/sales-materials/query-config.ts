export enum Entities {
  sales_material = "sales_material",
}

export const defaultAdminSalesMaterialFields = [
  "id",
  "shop_id",
  "sales_code",
  "sales_name",
  "sales_type",
  "basic_material_id",
  "is_bound",
  "customer_class_id",
  "org_id",
  "tax_rate",
  "tax_name",
  "tax_code",
  "source",
  "status",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminSalesMaterialRelations = []

export const allowedAdminSalesMaterialRelations = []

export const allowedAdminSalesMaterialFields = defaultAdminSalesMaterialFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminSalesMaterialFields,
  isList: false,
  entity: Entities.sales_material,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.sales_material,
}
