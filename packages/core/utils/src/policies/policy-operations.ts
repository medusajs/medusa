/**
 * The single character used as the RBAC wildcard across both resource and
 * operation slots.
 */
export const WILDCARD = "*"

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
