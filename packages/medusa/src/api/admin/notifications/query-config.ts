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
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
