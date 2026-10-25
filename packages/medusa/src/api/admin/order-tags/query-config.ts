export enum Entities {
  order_tag = "order_tag",
}

export const defaultAdminOrderTagFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
  "metadata",
]

export const retrieveOrderTagTransformQueryConfig = {
  defaults: defaultAdminOrderTagFields,
  isList: false,
  entity: Entities.order_tag,
}

export const listOrderTagsTransformQueryConfig = {
  ...retrieveOrderTagTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.order_tag,
}
