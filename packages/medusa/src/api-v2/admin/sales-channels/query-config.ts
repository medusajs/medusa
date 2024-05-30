export const defaultAdminSalesChannelFields = [
  "id",
  "name",
  "description",
  "is_disabled",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminSalesChannelFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
