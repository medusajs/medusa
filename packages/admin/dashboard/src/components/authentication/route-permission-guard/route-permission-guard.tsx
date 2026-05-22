import { ExclamationCircle } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Navigate, Outlet, useMatches } from "react-router-dom"
import { type Permission } from "../../../lib/permissions"
import {
  usePermissions,
  useRegisterPermissions,
} from "../../../providers/permissions-provider"

type PermissionRouteHandle = {
  /**
   * The permissions required to access the route.
   */
  permissions?: Permission | Permission[]
  /**
   * If true (default), the actor must hold ALL listed permissions.
   * If false, holding ANY one is enough.
   */
  requireAll?: boolean
  /**
   * Optional path to redirect to when access is denied. When omitted, the
   * access-denied page is rendered in place.
   */
  redirectTo?: string
}

type ResolvedRequirement = {
  permissions: Permission[]
  requireAll: boolean
  redirectTo?: string
}

const readRequirementFromHandle = (
  handle: unknown
): ResolvedRequirement | undefined => {
  if (!handle || typeof handle !== "object") {
    return undefined
  }

  const declared = handle as PermissionRouteHandle
  const rawPermissions = declared.permissions
  if (!rawPermissions) {
    return undefined
  }

  const permissions = Array.isArray(rawPermissions)
    ? rawPermissions
    : [rawPermissions]

  if (!permissions.every((permission) => typeof permission === "string")) {
    console.error(
      "Invalid permissions: all permissions must be strings",
      permissions
    )
    return undefined
  }

  if (!permissions.length) {
    return undefined
  }

  return {
    permissions,
    requireAll: declared.requireAll ?? true,
    redirectTo: declared.redirectTo,
  }
}

/**
 * Route-level permission guard. Mount it as the `element` of a route and
 * declare the permission requirement in the route's `handle.permissions`.
 *
 * Example:
 *
 * ```tsx
 * {
 *   path: "/customers/create",
 *   element: <RoutePermissionGuard />,
 *   handle: { permissions: "customer:create" },
 *   children: [...],
 * }
 * ```
 *
 * For routes with multiple required permissions:
 *
 * ```tsx
 * {
 *   path: "/customers/:id/orders",
 *   element: <RoutePermissionGuard />,
 *   handle: {
 *     permissions: ["customer:read", "order:read"],
 *     // requireAll defaults to true; set to false to require ANY
 *   },
 *   children: [...],
 * }
 * ```
 */
export const RoutePermissionGuard = () => {
  const matches = useMatches()
  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions()

  // Walk the matches from deepest to shallowest. The deepest route that
  // declares `handle.permissions` wins, so children can override a parent.
  const requirement = useMemo(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const found = readRequirementFromHandle(matches[i].handle)
      if (found) {
        return found
      }
    }
    return undefined
  }, [matches])

  useRegisterPermissions(requirement?.permissions ?? null, {
    requireAll: requirement?.requireAll ?? false,
    source: "route",
  })

  // Don't block while loading - TODO: reconsider this
  if (isLoading) {
    return <Outlet />
  }

  // No requirement declared anywhere up the tree → opt-out, render through.
  if (!requirement) {
    return <Outlet />
  }

  const hasAccess = requirement.requireAll
    ? hasAllPermissions(requirement.permissions)
    : hasAnyPermission(requirement.permissions)

  if (!hasAccess) {
    if (requirement.redirectTo) {
      return <Navigate to={requirement.redirectTo} replace />
    }

    return <AccessDenied requirement={requirement} />
  }

  return <Outlet />
}

interface AccessDeniedProps {
  requirement: ResolvedRequirement
}

const AccessDenied = ({ requirement }: AccessDeniedProps) => {
  const { t } = useTranslation()

  return (
    <div className="bg-ui-bg-subtle absolute bottom-0 left-0 right-0 top-0 flex min-h-screen items-center justify-center p-4">
      <Container className="max-w-md">
        <div className="flex flex-col items-center gap-y-4 py-8 text-center">
          <div className="bg-ui-bg-subtle flex h-12 w-12 items-center justify-center rounded-full">
            <ExclamationCircle className="text-ui-fg-muted" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Heading level="h2">{t("permissions.accessDenied.title")}</Heading>
            <Text className="text-ui-fg-subtle">
              {t("permissions.accessDenied.description")}
            </Text>
          </div>
          <Text size="small" className="text-ui-fg-muted">
            {t("permissions.accessDenied.requiredPermission", {
              permission: requirement.permissions.join(", "),
            })}
          </Text>
        </div>
      </Container>
    </div>
  )
}
