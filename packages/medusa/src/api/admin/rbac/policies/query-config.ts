export const defaultAdminRbacPolicyFields = [
  "id",
  "key",
  "resource",
  "operation",
  "name",
  "description",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRbacPolicyFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
}

export const defaultAdminRbacPolicyRolesFields = [
  "id",
  "role.id",
  "role.name",
  "role.description",
  "role.created_at",
  "role.updated_at",
  "role.users.id",
]

export const listRbacPolicyRolesTransformQueryConfig = {
  defaults: defaultAdminRbacPolicyRolesFields,
  defaultLimit: 10,
  isList: true,
}
