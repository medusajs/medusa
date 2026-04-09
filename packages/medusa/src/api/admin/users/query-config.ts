export enum Entities {
  user = "user",
  rbac_role = "rbac_role",
}

export const defaultAdminUserFields = [
  "id",
  "first_name",
  "last_name",
  "email",
  "avatar_url",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminUserFields,
  isList: false,
  entity: Entities.user,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.user,
}

export const defaultAdminUserRolesFields = [
  "user_id",
  "rbac_role_id",
  "rbac_role.*",
]

export const listUserRolesTransformQueryConfig = {
  defaults: defaultAdminUserRolesFields,
  isList: true,
  entity: Entities.rbac_role,
}
