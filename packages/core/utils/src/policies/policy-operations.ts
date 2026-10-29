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
