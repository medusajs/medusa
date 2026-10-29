/**
 * The single character used as the RBAC wildcard across both resource and
 * operation slots.
 */
export const WILDCARD = "*"

/**
 * The ID of the built-in super admin role, seeded by the RBAC module. It holds
 * the super admin policy and can't be deleted.
 */
export const RBAC_SUPER_ADMIN_ROLE_ID = "role_super_admin"

/**
 * The ID of the built-in super admin policy (`*:*`), seeded by the RBAC module.
 * It can't be deleted.
 */
export const RBAC_SUPER_ADMIN_POLICY_ID = "rpol_super_admin"

/**
 * Cache tags of the RBAC permission cache. They follow the
 * `<EntityPascal>:<id>` / `<EntityPascal>:list:*` format the caching module
 * computes from the RBAC module's `created` / `updated` / `deleted` /
 * `restored` events, so those events invalidate the cached entries.
 */
export const RBAC_CACHE_TAGS = {
  role: (roleId: string) => `RbacRole:${roleId}`,
  policy: (policyId: string) => `RbacPolicy:${policyId}`,
  POLICY_LIST: "RbacPolicy:list:*",
  ROLE_POLICY_LIST: "RbacRolePolicy:list:*",
  ROLE_PARENT_LIST: "RbacRoleParent:list:*",
} as const

/**
 * Medusa's own operations, as values.
 */
export const PolicyOperation = {
  read: "read",
  create: "create",
  update: "update",
  delete: "delete",
  [WILDCARD]: WILDCARD,
  ALL: WILDCARD,
} as const

/**
 * The operations every core resource is expanded with.
 */
export const CORE_POLICY_OPERATIONS = [
  PolicyOperation.read,
  PolicyOperation.create,
  PolicyOperation.update,
  PolicyOperation.delete,
] as const
