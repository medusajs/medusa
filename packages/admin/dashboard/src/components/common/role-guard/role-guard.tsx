import type { PropsWithChildren, ReactNode } from "react"
import { usePermissions } from "../../../providers/permissions-provider"

interface BaseRoleGuardProps extends PropsWithChildren {
  /**
   * Content to render when the role check fails.
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

interface RoleGuardWithRole extends BaseRoleGuardProps {
  /**
   * Single role name to check.
   */
  role: string
  roles?: never
  requireAll?: never
}

interface RoleGuardWithRoles extends BaseRoleGuardProps {
  /**
   * Multiple role names to check.
   */
  roles: string[]
  /**
   * If true, requires ALL roles. Default is ANY.
   */
  requireAll?: boolean
  role?: never
}

export type RoleGuardProps = RoleGuardWithRole | RoleGuardWithRoles

/**
 * Component that conditionally renders children based on the actor's assigned
 * roles. Complementary to `PermissionGuard` for cases where a coarse
 * role-level check is more practical than enumerating permissions.
 *
 * Roles are matched by their unique name against the actor's assigned
 * roles. Renaming a role breaks guards referencing the old name, so
 * it is well suited if your role names are stable.
 *
 * Like `PermissionGuard`, this is a UX guard only — the server keeps
 * enforcing access through policies, so the roles used here should cover the
 * permissions the guarded UI relies on.
 *
 * @example
 * ```tsx
 * // Single role
 * <RoleGuard role="Store Manager">
 *   <OrderActionsMenu />
 * </RoleGuard>
 *
 * // Multiple roles (ANY)
 * <RoleGuard roles={["Store Manager", "Support Lead"]}>
 *   <OrderActionsMenu />
 * </RoleGuard>
 *
 * // Multiple roles (ALL), with fallback
 * <RoleGuard
 *   roles={["Store Manager", "Finance"]}
 *   requireAll
 *   fallback={<Text>You don't have access to payouts</Text>}
 * >
 *   <PayoutsSection />
 * </RoleGuard>
 * ```
 */
export const RoleGuard = ({
  children,
  fallback = null,
  showLoading = false,
  loadingComponent = null,
  ...props
}: RoleGuardProps) => {
  const { hasAnyRole, hasAllRoles, isLoading } = usePermissions()

  const requiredRoles =
    "role" in props && props.role ? [props.role] : props.roles ?? []

  if (isLoading && showLoading) {
    return <>{loadingComponent}</>
  }

  const hasAccess = props.requireAll
    ? hasAllRoles(requiredRoles)
    : hasAnyRole(requiredRoles)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
