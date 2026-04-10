export enum Entities {
  notification = "notification",
}

export const defaultAdminNotificationFields = [
  "id",
  "to",
  "channel",
  "template",
  "data",
  "trigger_type",
  "resource_id",
  "resource_type",
  "receiver_id",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminNotificationFields,
  isList: false,
  entity: Entities.notification,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.notification,
}
