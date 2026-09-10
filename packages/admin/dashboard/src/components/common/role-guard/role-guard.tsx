import type { PropsWithChildren, ReactNode } from "react"
import type { RoleMatch } from "../../../lib/permissions"
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
  /**
   * How to match roles. `"covers"` (default) passes when the actor's
   * permissions include everything the role grants — a super admin covers
   * every role. `"assigned"` requires the role to be literally assigned.
   */
  match?: RoleMatch
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
 * Component that conditionally renders children based on the actor's roles.
 * Complementary to `PermissionGuard` for cases where a coarse role-level
 * check is more practical than enumerating permissions.
 *
 * Roles are matched by their unique name. By default a role matches when the
 * actor's effective permissions cover everything the role grants — so a
 * super admin passes every role check without being assigned the role, and
 * a role acts as a named permission bundle maintained in the dashboard.
 * Pass `match="assigned"` to require literal assignment instead.
 *
 * Renaming a role breaks guards referencing the old name, so it is well
 * suited if your role names are stable.
 *
 * Like `PermissionGuard`, this is a UX guard only — the server keeps
 * enforcing access through policies.
 *
 * @example
 * ```tsx
 * // Passes for anyone whose permissions encompass the Billing role's
 * // policies — including a super admin who was never assigned it.
 * <RoleGuard role="Billing" fallback={<Text>No access</Text>}>
 *   <BillingSection />
 * </RoleGuard>
 *
 * // Multiple roles (ANY)
 * <RoleGuard roles={["Store Manager", "Support Lead"]}>
 *   <OrderActionsMenu />
 * </RoleGuard>
 *
 * // Multiple roles (ALL)
 * <RoleGuard roles={["Store Manager", "Finance"]} requireAll>
 *   <PayoutsSection />
 * </RoleGuard>
 *
 * // Identity check, for the "literally holds this role" case.
 * <RoleGuard role="Auditor" match="assigned">
 *   <AuditLogExport />
 * </RoleGuard>
 * ```
 */
export const RoleGuard = ({
  children,
  fallback = null,
  showLoading = false,
  loadingComponent = null,
  match = "covers",
  ...props
}: RoleGuardProps) => {
  const { hasAnyRole, hasAllRoles, isLoading } = usePermissions()

  const requiredRoles =
    "role" in props && props.role ? [props.role] : props.roles ?? []

  if (isLoading && showLoading) {
    return <>{loadingComponent}</>
  }

  const hasAccess = props.requireAll
    ? hasAllRoles(requiredRoles, match)
    : hasAnyRole(requiredRoles, match)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
