export enum Entities {
  sales_channel = "sales_channel",
}

export const defaultAdminSalesChannelFields = [
  "id",
  "name",
  "description",
  "is_disabled",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminSalesChannelFields,
  isList: false,
  entity: Entities.sales_channel,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.sales_channel,
}
