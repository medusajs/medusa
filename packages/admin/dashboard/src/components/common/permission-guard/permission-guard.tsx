import type { PropsWithChildren, ReactNode } from "react"
import type {
  Permission,
  PermissionOperation,
  PermissionResource,
} from "../../../lib/permissions"
import { buildPermission } from "../../../lib/permissions"
import {
  usePermissions,
  useRegisterPermissions,
} from "../../../providers/permissions-provider"

interface BasePermissionGuardProps extends PropsWithChildren {
  /**
   * Content to render when permission is denied.
   * If not provided, nothing is rendered.
   */
  fallback?: ReactNode
  /**
   * If true, shows a loading state while permissions are being loaded.
   */
  showLoading?: boolean
  /**
   * Custom loading component.
   */
  loadingComponent?: ReactNode
}

interface PermissionGuardWithPermission extends BasePermissionGuardProps {
  /**
   * Single permission to check.
   */
  permission: Permission
  permissions?: never
  resource?: never
  operation?: never
  requireAll?: never
}

interface PermissionGuardWithPermissions extends BasePermissionGuardProps {
  /**
   * Multiple permissions to check.
   */
  permissions: Permission[]
  /**
   * If true, requires ALL permissions. Default is ANY.
   */
  requireAll?: boolean
  permission?: never
  resource?: never
  operation?: never
}

interface PermissionGuardWithResourceOperation
  extends BasePermissionGuardProps {
  /**
   * Resource to check permission for.
   */
  resource: PermissionResource
  /**
   * Operation to check permission for.
   */
  operation: PermissionOperation
  permission?: never
  permissions?: never
  requireAll?: never
}

export type PermissionGuardProps =
  | PermissionGuardWithPermission
  | PermissionGuardWithPermissions
  | PermissionGuardWithResourceOperation

/**
 * Component that conditionally renders children based on user permissions.
 *
 * @example
 * ```tsx
 * // Using resource and operation
 * <PermissionGuard resource="customer" operation="create">
 *   <Button>Create Customer</Button>
 * </PermissionGuard>
 *
 * // Using permission string
 * <PermissionGuard permission="customer:read">
 *   <CustomerList />
 * </PermissionGuard>
 *
 * // Using multiple permissions (ANY)
 * <PermissionGuard permissions={["customer:update", "customer:manage"]}>
 *   <EditButton />
 * </PermissionGuard>
 *
 * // Using multiple permissions (ALL)
 * <PermissionGuard
 *   permissions={["customer:read", "order:read"]}
 *   requireAll
 * >
 *   <CustomerOrdersView />
 * </PermissionGuard>
 *
 * // With fallback
 * <PermissionGuard
 *   resource="customer"
 *   operation="delete"
 *   fallback={<Text>You don't have permission to delete customers</Text>}
 * >
 *   <DeleteButton />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard = ({
  children,
  fallback = null,
  showLoading = false,
  loadingComponent = null,
  ...props
}: PermissionGuardProps) => {
  let requiredPermissions: Permission[] | null = null
  let requireAll = false

  if ("permission" in props && props.permission) {
    requiredPermissions = [props.permission]
  } else if ("permissions" in props && props.permissions) {
    requiredPermissions = props.permissions
    requireAll = !!props.requireAll
  } else if ("resource" in props && "operation" in props) {
    requiredPermissions = [buildPermission(props.resource, props.operation)]
  }

  useRegisterPermissions(requiredPermissions, { requireAll })

  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions()

  if (isLoading && showLoading) {
    return <>{loadingComponent}</>
  }

  const hasAccess = props.requireAll
    ? hasAllPermissions(requiredPermissions ?? [])
    : hasAnyPermission(requiredPermissions ?? [])

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
