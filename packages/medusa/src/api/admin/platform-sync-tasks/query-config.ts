export enum Entities {
  platform_sync_task = "platform_sync_task",
}

export const defaultAdminPlatformSyncTaskFields = [
  "id",
  "shop_id",
  "platform_type",
  "action",
  "payload",
  "status",
  "error_msg",
  "retry_count",
  "created_at",
  "updated_at",
]

export const defaultAdminPlatformSyncTaskRelations = []

export const allowedAdminPlatformSyncTaskRelations = []

export const allowedAdminPlatformSyncTaskFields =
  defaultAdminPlatformSyncTaskFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminPlatformSyncTaskFields,
  isList: false,
  entity: Entities.platform_sync_task,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.platform_sync_task,
}
