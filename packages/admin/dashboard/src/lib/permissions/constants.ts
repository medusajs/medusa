import type { PermissionOperation } from "./types"

/**
 * Map of operations to the operations they imply.
 * The wildcard (*) implies all CRUD operations.
 */
export const OPERATION_IMPLICATIONS: Record<
  PermissionOperation,
  PermissionOperation[]
> = {
  read: ["read"],
  create: ["create"],
  update: ["update"],
  delete: ["delete"],
  "*": ["read", "create", "update", "delete", "*"],
}
