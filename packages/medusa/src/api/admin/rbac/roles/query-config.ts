export enum Entities {
  user = "user",
  rbac_role = "rbac_role",
  rbac_role_assignment = "rbac_role_assignment",
}

export const defaultAdminRbacRoleFields = [
  "id",
  "name",
  "parent_id",
  "description",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRbacRoleFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
}

export const defaultAdminRolePoliciesFields = [
  "id",
  "role_id",
  "policy_id",
  "policy",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveRolePoliciesTransformQueryConfig = {
  defaults: defaultAdminRolePoliciesFields,
  isList: false,
}

export const listRolePoliciesTransformQueryConfig = {
  ...retrieveRolePoliciesTransformQueryConfig,
  isList: true,
}

export const defaultAdminRoleUsersFields = [
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

export const listRoleUsersTransformQueryConfig = {
  defaults: defaultAdminRoleUsersFields,
  isList: true,
  entity: Entities.user,
}

export const defaultAdminRoleAssignmentFields = [
  "id",
  "role_id",
  "reference",
  "reference_id",
  "scope",
  "scope_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const listRoleAssignmentsTransformQueryConfig = {
  defaults: defaultAdminRoleAssignmentFields,
  isList: true,
  entity: Entities.rbac_role_assignment,
}
