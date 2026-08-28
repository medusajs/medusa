/**
 * Public hook exports for `@medusajs/dashboard/hooks`.
 */

export * from "../hooks/use-resource-permissions"
export {
  usePermissions,
  useRegisterPermissions,
  useRequiredPermissions,
  PermissionsProvider,
  PermissionsRequirement,
} from "../providers/permissions-provider"
export {
  PermissionGuard,
  type PermissionGuardProps,
} from "../components/common/permission-guard/permission-guard"
export {
  RoleGuard,
  type RoleGuardProps,
} from "../components/common/role-guard/role-guard"
export { NoPermissions } from "../routes/no-permissions/no-permissions"
