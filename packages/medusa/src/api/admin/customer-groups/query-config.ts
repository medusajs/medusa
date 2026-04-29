export enum Entities {
  customer_group = "customer_group",
}

export const defaultAdminCustomerGroupFields = [
  "id",
  "name",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCustomerGroupFields,
  isList: false,
  entity: Entities.customer_group,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.customer_group,
}
