export enum Entities {
  order = "order",
  order_change = "order_change",
}

export const defaultAdminOrderEditFields = [
  "id",
  "order_id",
  "display_id",
  "order_version",
  "created_at",
  "updated_at",
  "canceled_at",
]

export const defaultAdminDetailsOrderEditFields = [
  ...defaultAdminOrderEditFields,
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminDetailsOrderEditFields,
  isList: false,
  entity: Entities.order,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminOrderEditFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.order,
}
