import { Entities } from "../roles/query-config"

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
  entity: Entities.rbac_policy,
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
]

export const listRbacPolicyRolesTransformQueryConfig = {
  defaults: defaultAdminRbacPolicyRolesFields,
  defaultLimit: 10,
  isList: true,
  entity: Entities.rbac_role_policy,
}
